/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the footer content
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) mainGrid = element;
  
  // Find all direct children columns of the grid
  const gridCols = Array.from(mainGrid.children);

  // Find content blocks by their class
  const logoCol = gridCols.find(col => col.className && col.className.includes('cmp-image--logo'));
  const navCol = gridCols.find(col => col.className && col.className.includes('cmp-navigation--footer'));
  const followCol = gridCols.find(col => col.className && col.className.includes('cmp-title--right'));
  const socialCol = gridCols.find(col => col.className && col.className.includes('cmp-buildingblock--btn-list'));
  const legalCol = gridCols.find(col => col.className && col.className.includes('cmp-text--font-xsmall'));

  // Compose the content for the single cell
  const cellContent = [];
  if (logoCol) cellContent.push(logoCol);
  if (navCol) cellContent.push(navCol);
  if (followCol) cellContent.push(followCol);
  if (socialCol) cellContent.push(socialCol);
  if (legalCol) cellContent.push(legalCol);

  // Guard: If no content found, do nothing
  if (cellContent.length === 0) return;

  // Compose the table cells array
  const cells = [
    ['Table'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
