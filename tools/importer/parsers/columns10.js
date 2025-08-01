/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the logo, navigation, and social columns
  const mainGrids = element.querySelectorAll('.cmp-layoutcontainer--footer > .cmp-container > .aem-Grid');
  let mainGrid = null;
  // Find the deepest matching grid
  if (mainGrids.length > 0) {
    mainGrid = mainGrids[mainGrids.length - 1];
  }
  if (!mainGrid) return;

  // Find logo column
  const logoCol = mainGrid.querySelector('.cmp-image--logo');
  // Find nav column
  const navCol = mainGrid.querySelector('.cmp-navigation--footer');

  // Find Follow Us column: composed of title and social list
  const titleCol = mainGrid.querySelector('.cmp-title--right');
  const socialCol = mainGrid.querySelector('.cmp-buildingblock--btn-list');
  let socialCellContent = [];
  if (titleCol) socialCellContent.push(titleCol);
  if (socialCol) socialCellContent.push(socialCol);
  if (socialCellContent.length === 0) socialCellContent = '';
  else if (socialCellContent.length === 1) socialCellContent = socialCellContent[0];

  // Compose columns row, always 3 columns as in screenshot
  const columnsRow = [logoCol, navCol, socialCellContent];

  // Find the text block at the bottom
  const textDiv = element.querySelector('.cmp-text--font-xsmall .cmp-text') || element.querySelector('.cmp-text--font-xsmall');
  
  // Build the table rows
  const rows = [
    ['Columns (columns10)'],
    columnsRow,
  ];
  if (textDiv) {
    rows.push([textDiv]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
