/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid (footer layout)
  const grids = element.querySelectorAll('.aem-Grid');
  const grid = grids[grids.length - 1] || element;

  // Extract logo (left column)
  let logoCol = '';
  const logoDiv = grid.querySelector('.image');
  if (logoDiv) {
    const logoLink = logoDiv.querySelector('a');
    if (logoLink) logoCol = logoLink.outerHTML;
    else logoCol = logoDiv.outerHTML;
  }

  // Extract navigation (middle column)
  let navCol = '';
  const navDiv = grid.querySelector('.navigation');
  if (navDiv) {
    const nav = navDiv.querySelector('nav');
    navCol = nav ? nav.outerHTML : navDiv.outerHTML;
  }

  // Extract "Follow Us" title and social buttons (right column)
  let followUsCol = '';
  const titleDiv = grid.querySelector('.title');
  const socialDiv = grid.querySelector('.buildingblock');
  if (titleDiv || socialDiv) {
    let html = '';
    if (titleDiv) html += titleDiv.outerHTML;
    if (socialDiv) html += socialDiv.outerHTML;
    followUsCol = html;
  }

  // Extract all footer text blocks (should be grouped in one cell)
  let textCol = '';
  const textBlocks = Array.from(grid.querySelectorAll('.text'));
  if (textBlocks.length) {
    // Use .outerHTML so all text and structure is included
    textCol = textBlocks.map(tb => tb.outerHTML).join('');
  }

  // Compose table rows
  const headerRow = ['Columns (columns10)'];
  const row2 = [logoCol, navCol, followUsCol];
  // Place all text blocks in a single cell spanning all columns
  const row3 = [textCol];

  const cells = [
    headerRow,
    row2,
    row3,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
