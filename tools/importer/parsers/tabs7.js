/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Extract tab panels in the order they appear
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabPanels.length === 0) return;

  // First row: header
  const headerRow = ['Tabs (tabs7)'];
  // Second row: tab labels
  const tabLabelRow = tabLabels;

  // Subsequent rows: each tab panel content, matching label order
  // Each row should have same number of columns as tabLabelRow, only one cell populated per row (the content), others blank
  // But the markdown shows: header row (1 cell), label row (N cells), then N rows each with the content for that tab, only second column used
  // However, the screenshot and block description suggest: first row is header, next row is tab labels, then one row per tab with tab content only in a single cell (column 2), rest blank.

  // Compose rows: for each tab, create a row with empty cells except cell at correct index (matching tab label order)
  const contentRows = tabPanels.map((panel, idx) => {
    const cells = new Array(tabLabels.length).fill('');
    // Use the article element inside the panel if present, else panel itself
    const article = panel.querySelector('article');
    cells[idx] = article || panel;
    return cells;
  });

  const tableData = [headerRow, tabLabelRow, ...contentRows];

  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
