/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block - look for the .tabs .cmp-tabs element inside element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all the tab <li> elements (labels)
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLiElements = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // For each tab, extract label and corresponding panel/content
  const tabRows = tabLiElements.map(tabEl => {
    const label = tabEl.textContent.trim();
    const tabPanelId = tabEl.getAttribute('aria-controls');
    const panel = tabsBlock.querySelector(`#${tabPanelId}`);
    // If the panel is missing, cell is empty string
    return [label, panel ? panel : ''];
  });

  // Compose the final table structure
  // First row: block header (single column)
  const rows = [];
  rows.push(['Tabs (tabs12)']);
  // Subsequent rows: each tab, first col is label, second col is content
  rows.push(...tabRows);

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
