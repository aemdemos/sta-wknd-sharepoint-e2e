/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Block header row as required
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // Get tab labels and tab panels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if counts match
  if (tabLabels.length !== tabPanels.length) return;

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Extract the full HTML content of the tab panel as a string
    const div = document.createElement('div');
    // Move all children into the div
    Array.from(panel.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
    rows.push([label, div]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  element.replaceWith(table);
}
