/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs34)'];

  // Find all tab labels (li elements inside ol[role=tablist])
  const tabList = element.querySelector('ol[role="tablist"]');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Find all tab panels (div[role=tabpanel][data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(element.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: each row [tab label, tab content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab label cell: use the textContent
    const label = tabLabel.textContent.trim();
    // Tab content cell: clone the tabPanel so we don't move it in the DOM
    const panelClone = tabPanels[idx].cloneNode(true);
    // Remove the tabPanel wrapper div, use its children as content
    const content = Array.from(panelClone.childNodes);
    // If only one child, use it directly, else use array
    return [label, content.length === 1 ? content[0] : content];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
