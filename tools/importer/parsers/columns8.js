/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid (aem-Grid) that contains the footer content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Gather content for each logical column
  const logoCol = grid.querySelector('.image');
  const navCol = grid.querySelector('.navigation');
  const socialTitle = grid.querySelector('.title');
  const socialBtns = grid.querySelector('.buildingblock');

  // Compose the social column
  const socialCol = [];
  if (socialTitle) socialCol.push(socialTitle);
  if (socialBtns) socialCol.push(socialBtns);

  // Build columns row, each cell is an array of elements (possibly empty)
  const columnsRow = [];
  if (logoCol) columnsRow.push(logoCol);
  if (navCol) columnsRow.push(navCol);
  if (socialCol.length > 0) columnsRow.push(socialCol);

  // Footer/copyright text row
  const footerText = grid.querySelector('.text');
  let footerRow = [];
  if (footerText) {
    // The copyright row is a single cell spanning all columns, pad with empty cells
    footerRow = [footerText];
    while (footerRow.length < columnsRow.length) footerRow.push('');
  }

  // Compose the table
  // Header row is a single column matching example: [['Columns (columns8)']]
  const cells = [
    ['Columns (columns8)'],
    columnsRow,
  ];
  if (footerRow.length) cells.push(footerRow);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
