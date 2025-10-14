/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid for the main columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Extract columns: logo, navigation, follow us, social buttons
  const logoCol = grid.querySelector('.image');
  const navCol = grid.querySelector('.navigation');
  const titleCol = grid.querySelector('.title');
  const btnCol = grid.querySelector('.buildingblock');

  // Compose main columns
  const mainColumns = [
    logoCol ? logoCol.querySelector('[data-cmp-is="image"]') || logoCol : '',
    navCol ? navCol.querySelector('nav') || navCol : '',
    titleCol ? titleCol.querySelector('.cmp-title') || titleCol : '',
    btnCol ? btnCol.querySelector('.aem-Grid') || btnCol : ''
  ];

  // Find separator and all text blocks (legal/informational)
  const separator = element.querySelector('.separator hr') || element.querySelector('hr');
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  // Place all info in a single cell spanning all columns
  const infoRow = [[separator, ...textBlocks]];

  // Table rows
  const headerRow = ['Columns (columns5)'];
  const cells = [
    headerRow,
    mainColumns,
    infoRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan on the info row
  if (block.rows[2] && block.rows[2].cells.length === 1) {
    block.rows[2].cells[0].setAttribute('colspan', mainColumns.length);
  }
  element.replaceWith(block);
}
