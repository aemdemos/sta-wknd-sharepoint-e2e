/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: image, navigation, search
  // Only include columns with meaningful content
  const columns = Array.from(grid.children).filter(col => {
    // Accept columns with non-empty text or images/forms/nav
    return col.textContent.trim() || col.querySelector('img,nav,form,section');
  });

  // The block header must be exactly as specified
  const headerRow = ['Columns (columns2)'];

  // Each column cell should contain the original column element (preserving semantics)
  const contentRow = columns.map(col => col);

  // Create the table for the block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
