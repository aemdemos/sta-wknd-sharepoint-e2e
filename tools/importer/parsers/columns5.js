/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) grid = element;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper to find a child by class
  function findByClass(cls) {
    return columns.find((col) => col.classList.contains(cls));
  }

  // Column 1: Logo
  const logoCol = findByClass('image');
  let logoBlock = null;
  if (logoCol) {
    const cmpImage = logoCol.querySelector('.cmp-image');
    logoBlock = cmpImage || logoCol;
  }

  // Column 2: Navigation
  const navCol = findByClass('navigation');
  let navBlock = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    navBlock = nav || navCol;
  }

  // Column 3: Title ("Follow Us")
  const titleCol = findByClass('title');
  let titleBlock = null;
  if (titleCol) {
    const cmpTitle = titleCol.querySelector('.cmp-title');
    titleBlock = cmpTitle || titleCol;
  }

  // Column 4: Social Buttons
  const btnListCol = findByClass('buildingblock');
  let btnBlock = null;
  if (btnListCol) {
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    btnBlock = btnGrid || btnListCol;
  }

  // Column 5: Footer Texts (all .cmp-text)
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));
  let textCell = null;
  if (textBlocks.length === 1) {
    textCell = textBlocks[0];
  } else if (textBlocks.length > 1) {
    textCell = textBlocks;
  }

  // Compose the columns row
  const columnsRow = [
    logoBlock,
    navBlock,
    [titleBlock, btnBlock], // combine title and buttons in one cell
    textCell
  ];

  // Remove any undefined/null columns
  const filteredColumnsRow = columnsRow.filter((col) => col);

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Compose table
  const cells = [
    headerRow,
    filteredColumnsRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
