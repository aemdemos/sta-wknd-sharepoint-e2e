/* global WebImporter */
export default function parse(element, { document }) {
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels (li elements in tablist)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (content containers)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure there is at least one label and panel
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row: Block Name
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab label/panel, match them in order
  for (let i = 0; i < Math.min(tabLabels.length, tabPanels.length); i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // For resilience, reference the first .contentfragment/article if present, else the panel itself
    let contentElem = panel.querySelector('article');
    if (!contentElem) contentElem = panel;
    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block root with the new table
  tabsRoot.replaceWith(table);
}
