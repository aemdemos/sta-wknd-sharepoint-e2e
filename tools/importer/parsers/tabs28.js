/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li[role=tab] inside the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]'));
  // Get all tab panels (div[role=tabpanel][data-cmp-hook-tabs=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: only keep as many panels as labels
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Prepare the header row (block name and variant exactly as required)
  const headerRow = ['Tabs (tabs28)'];

  // Each tab row: [labelEl, panelEl]
  const rows = [];
  for (let i = 0; i < count; i++) {
    // Use the existing tab label element as the cell (for possible future variants, bold, etc.)
    // But we want just the text, so create a text node with the trimmed text content.
    const labelNode = document.createTextNode(tabLabels[i].textContent.trim());
    // Use the tab content panel as-is. (Reference, don't clone)
    const panelEl = tabPanels[i];
    rows.push([labelNode, panelEl]);
  }

  // Build the table array
  const tableArray = [headerRow, ...rows];

  // Create table and replace original tabs element
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  tabs.replaceWith(table);
}
