/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the header columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Identify the three main columns: logo, navigation, search
  let logoCol = null, navCol = null, searchCol = null;
  Array.from(grid.children).forEach((col) => {
    if (col.classList.contains('image')) logoCol = col;
    else if (col.classList.contains('navigation')) navCol = col;
    else if (col.classList.contains('search')) searchCol = col;
  });
  // Always produce 3 columns, using empty string if missing
  const row = [logoCol || '', navCol || '', searchCol || ''];
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns5)'],
    row,
  ], document);
  element.replaceWith(table);
}
