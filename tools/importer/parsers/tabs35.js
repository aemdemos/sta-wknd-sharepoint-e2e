/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li in tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (div[role=tabpanel].cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only match as many as both labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose the block table
  // First row: Header (single cell)
  const cells = [
    ['Tabs (tabs35)']
  ];

  // Second row: all tab labels, one column per tab
  const labelRow = [];
  for (let i = 0; i < numTabs; i++) {
    labelRow.push(tabLabels[i].textContent.trim());
  }
  cells.push(labelRow);

  // Third row: all tab contents, one column per tab
  const contentRow = [];
  for (let i = 0; i < numTabs; i++) {
    // Tab content: reference the existing tab panel element directly
    contentRow.push(tabPanels[i]);
  }
  cells.push(contentRow);

  // Create the table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
