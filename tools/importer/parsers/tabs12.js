/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab label elements (li in the cmp-tabs__tablist)
  const tabLabelElements = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Find the tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanelElements = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Only use as many as both labels and panelse we have
  const numTabs = Math.min(tabLabels.length, tabPanelElements.length);
  const labelsRow = tabLabels.slice(0, numTabs);
  const contentsRow = tabPanelElements.slice(0, numTabs);

  // Compose the final table data: header, labels, content (all one row)
  const tableData = [
    ['Tabs (tabs12)'],
    labelsRow,
    contentsRow,
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the entire tabs block with the new table
  tabsBlock.replaceWith(table);
}
