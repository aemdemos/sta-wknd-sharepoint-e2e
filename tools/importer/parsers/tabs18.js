/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels (li elements in tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (content areas that map to tab labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: only as many tabs as we have both label+panel
  const count = Math.min(tabLabels.length, tabPanels.length);

  // The header row should contain exactly one column, matching the example
  const rows = [['Tabs (tabs18)']];

  for (let i = 0; i < count; i++) {
    // Tab label
    const tabLabel = tabLabels[i]?.textContent?.trim() || '';
    // Tab content: grab the relevant content fragment, or fallback
    let contentElem = null;
    // Try to find a .contentfragment inside the panel, otherwise fallback to first element child, or the panel itself
    contentElem = tabPanels[i].querySelector('.contentfragment')
      || tabPanels[i].firstElementChild
      || tabPanels[i];
    // Each row is an array containing an array of [Tab Label, Content Element] as a single cell (to maintain 1-column table)
    rows.push([[tabLabel, contentElem]]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
