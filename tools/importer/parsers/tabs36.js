/* global WebImporter */
export default function parse(element, { document }) {
  // Find tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []).map(tab => tab.textContent.trim());
  if (tabLabels.length === 0) return;

  // Get tab panels in the same order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;

  // Compose table rows
  const cells = [];
  // Header row (single column)
  cells.push(['Tabs (tabs36)']);
  // Tab labels row (each label in its own cell)
  cells.push(tabLabels);
  // Single content row, one cell per tab (each cell is the tab content)
  const contentRow = tabPanels.map(panel => {
    let tabContent = panel.querySelector('.cmp-contentfragment') || panel.querySelector('article') || panel.querySelector('div');
    if (!tabContent) tabContent = panel;
    return tabContent;
  });
  cells.push(contentRow);

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
