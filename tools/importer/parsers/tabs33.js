/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabRoot = element.querySelector('.cmp-tabs');
  if (!tabRoot) return;

  // Find all tab labels and all tabpanel containers
  const tabLabels = Array.from(tabRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabPanels = Array.from(tabRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: skip if mismatch or none
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Block header row: must be a single-cell array
  const headerRow = ['Tabs (tabs33)'];

  // Each tab row: [label, content] (label = string, content = element)
  const rows = tabLabels.map((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];
    return [label, panel]; // Use panel reference
  });

  // Build the table content (all rows are arrays):
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs block with the table
  element.replaceWith(table);
}
