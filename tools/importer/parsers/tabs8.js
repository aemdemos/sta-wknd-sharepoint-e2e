/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements, role="tab")
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  if (tabLabels.length === 0) return;

  // Find tab panels corresponding to each tab
  const tabPanels = tabLabels.map(tab => {
    const tabId = tab.getAttribute('aria-controls');
    if (!tabId) return null;
    return tabsBlock.querySelector(`#${tabId}`);
  });

  // Defensive: filter out missing panels and align with labels
  const validTabs = tabLabels.map((labelEl, i) => {
    if (!tabPanels[i]) return null;
    return {
      label: labelEl.textContent.trim(),
      content: tabPanels[i].querySelector('.contentfragment') || tabPanels[i]
    };
  }).filter(Boolean);
  if (validTabs.length === 0) return;

  // Build the table: header row, then one row per tab (label, content)
  const cells = [];
  cells.push(['Tabs (tabs8)']);
  validTabs.forEach(tab => {
    cells.push([tab.label, tab.content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
