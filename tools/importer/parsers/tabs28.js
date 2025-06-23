/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels (the headers of the tabs)
  const tabHeaders = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (the content areas for each tab)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: each tab label is its own column, in order
  const headerRow = tabHeaders.map(tab => tab.textContent.trim());
  // Content row: each cell is the main content element for that tab
  const contentRow = tabPanels.map(panel => {
    // Use the main content element in each panel, fallback to the panel itself
    const mainContent = panel.querySelector('article') || panel.querySelector('.cmp-contentfragment') || panel;
    return mainContent;
  });

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
