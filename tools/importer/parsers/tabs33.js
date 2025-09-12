/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // Get all tab labels (li elements)
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if labels and panels are present and match
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Instead of moving or cloning, use innerHTML as a string for the cell
      content = document.createElement('div');
      content.innerHTML = panel.innerHTML;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the table
  element.replaceWith(table);
}
