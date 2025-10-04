/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the .cmp-container
  const cmpContainer = getDirectChildByClass(element, 'cmp-container');
  if (!cmpContainer) return;

  // Find the .aem-Grid
  const aemGrid = getDirectChildByClass(cmpContainer, 'aem-Grid');
  if (!aemGrid) return;

  // Get all direct children of .aem-Grid (these are the columns visually)
  const columns = Array.from(aemGrid.children);

  // Defensive: Only keep columns that have content (ignore accidental empty columns)
  const contentColumns = columns.filter(col => col.textContent.trim() || col.querySelector('img') || col.querySelector('nav') || col.querySelector('form'));

  // Build the table rows
  const headerRow = ['Columns (columns2)'];

  // The block is always a single row of columns (logo, nav, search)
  // Each column cell should contain the full content of the respective column
  const contentRow = contentColumns.map(col => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
