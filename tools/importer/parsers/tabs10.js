/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels (li elements inside tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Extract tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Edge case: tab count mismatch
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) {
    return;
  }

  // 1. Header row: single cell with correct block name
  const headerRow = ['Tabs (tabs10)'];

  // 2. Tab label row (one per tab): use <strong> for each
  const labelRow = tabLabels.map(li => {
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // 3. Tab content row (one per tab): reference the main content fragment, or fall back to panel
  const contentRow = tabPanels.map(panel => {
    const fragment = panel.querySelector('.contentfragment');
    if (fragment) return fragment;
    const article = panel.querySelector('article');
    if (article) return article;
    return panel;
  });

  // Compose final cells array in the correct structure
  // First row: header (1 cell)
  // Second row: tab labels (N cells)
  // Third row: tab contents (N cells)
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create the block table and replace the original element.
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
