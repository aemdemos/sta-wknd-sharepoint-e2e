/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest aem-Grid, which contains the main content columns
  const footerGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!footerGrid) return;
  // Collect columns: logo, navigation, title + social buttons
  const logoCol = footerGrid.querySelector('.image');
  const navigationCol = footerGrid.querySelector('.navigation');
  const titleCol = footerGrid.querySelector('.title');
  const socialsCol = footerGrid.querySelector('.cmp-buildingblock--btn-list');
  // Compose row 2: three columns (logo, navigation, title+socials)
  const columnsRow = [
    logoCol,
    navigationCol,
    [titleCol, socialsCol]
  ];
  // Find all the .cmp-text blocks for extra rows
  const textBlocks = Array.from(footerGrid.querySelectorAll('.cmp-text'));
  // Each extra row is a single cell containing its .cmp-text block
  const textRows = textBlocks.map(textBlock => [textBlock]);
  // Header row as specified
  const headerRow = ['Columns (columns9)'];
  // Compose the cells for the block table
  const cells = [headerRow, columnsRow, ...textRows];
  // Create table, reference all real elements
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
