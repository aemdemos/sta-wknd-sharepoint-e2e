/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the footer columns
  function findMainGrid(el) {
    // Look for the deepest .aem-Grid.aem-Grid--12
    let grids = Array.from(el.querySelectorAll('.aem-Grid.aem-Grid--12'));
    // Return the last (deepest) one
    return grids[grids.length - 1] || null;
  }

  const grid = findMainGrid(element);
  if (!grid) return;

  // Find the three main columns
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  const navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  // The third column is "Follow Us" title and the social buttons
  const titleCol = grid.querySelector('.title.cmp-title--white');
  const btnListCol = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');

  // Compose the "Follow Us" cell content (title + buttons)
  const followUsContent = [];
  if (titleCol) {
    const titleDiv = titleCol.querySelector('.cmp-title');
    if (titleDiv) followUsContent.push(titleDiv);
  }
  if (btnListCol) {
    // Grab the grid of buttons for social networks
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    if (btnGrid) followUsContent.push(btnGrid);
  }

  // The table header row
  const headerRow = ['Columns (columns5)'];
  // The main columns row
  const columnsRow = [logoCol, navCol, followUsContent];

  // The two content rows in the footer are .text.cmp-text--font-xsmall blocks. We want them as two rows, each spanning all columns.
  const textBlocks = Array.from(grid.querySelectorAll('.text.cmp-text--font-xsmall'));
  const contentRows = textBlocks.map(tb => [tb]);

  // Compose all cells
  const cells = [
    headerRow,
    columnsRow,
    ...contentRows
  ];

  // Replace the element with the newly created table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
