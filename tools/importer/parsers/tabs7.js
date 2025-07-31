/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (li[role="tab"])
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  // Compose tab label row: use <strong> for the active tab, otherwise plain text
  const tabLabelRow = tabLabelEls.map(tabEl => {
    if (tabEl.classList.contains('cmp-tabs__tab--active')) {
      const strong = document.createElement('strong');
      strong.textContent = tabEl.textContent.trim();
      return strong;
    }
    return tabEl.textContent.trim();
  });

  // Find all tab panels in order (should correspond to tab labels)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));
  // Compose tab content row: each cell contains the main content for a tab
  const tabContentRow = tabPanels.map(panel => {
    let content = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (!content) content = panel;
    return content;
  });

  // Build the table structure
  // Row 1: header (single cell)
  // Row 2: tab labels (multiple columns)
  // Row 3: tab content (multiple columns)
  const tableCells = [
    ['Tabs (tabs7)'],
    tabLabelRow,
    tabContentRow
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
