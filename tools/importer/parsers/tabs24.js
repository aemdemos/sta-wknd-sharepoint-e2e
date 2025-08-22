/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block in the element
  let tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) {
    tabsRoot = element.querySelector('[class*="tabs"]');
  }
  if (!tabsRoot) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panel content containers
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: Must match example exactly
  const headerRow = ['Tabs (tabs24)'];
  // Row 2: All tab labels (first row after header)
  const labelRow = tabLabels.map(label => {
    // Use exact text from label, wrapped in a <span> for formatting
    const span = document.createElement('span');
    span.textContent = label.textContent.trim();
    return span;
  });

  // Each subsequent row contains a single tab's content in the matching cell; others blank for col alignment
  const rows = tabPanels.map((panel, idx) => {
    // Column count = tabLabels.length
    const cells = Array(tabLabels.length).fill('');
    // Reference panel element itself for correct semantic meaning and nested structure
    cells[idx] = panel;
    return cells;
  });

  // Build the table block
  const tableCells = [headerRow, labelRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(table);
}
