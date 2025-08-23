/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell array
  const headerRow = ['Columns (columns2)'];

  // Find the main grid container within this header block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid, which should be the three major columns
  const gridColumns = Array.from(grid.querySelectorAll(':scope > div'));

  // Find the logo/image column - look for class including 'image'
  const logoDiv = gridColumns.find(div => div.classList.contains('image'));
  let logoBlock = null;
  if (logoDiv) {
    // The actual logo may be a nested div with the image and link
    // We use the entire image block (with link & image)
    const logoImageBlock = logoDiv.querySelector('div[data-cmp-is="image"]');
    if (logoImageBlock) logoBlock = logoImageBlock;
  }

  // Find the navigation column
  const navDiv = gridColumns.find(div => div.classList.contains('navigation'));
  let navBlock = null;
  if (navDiv) {
    // Use the entire nav block
    const nav = navDiv.querySelector('nav.cmp-navigation');
    if (nav) navBlock = nav;
  }

  // Find the search column
  const searchDiv = gridColumns.find(div => div.classList.contains('search'));
  let searchBlock = null;
  if (searchDiv) {
    // Use the entire section block for search
    const search = searchDiv.querySelector('section.cmp-search');
    if (search) searchBlock = search;
  }

  // Compose the row: logo, navigation, search
  // ALWAYS include 3 columns per row as in the visual layout (even if some are missing)
  const columnsRow = [logoBlock, navBlock, searchBlock].map(cell => cell || '');

  // Compose the table: header row (single cell), second row (3 columns)
  const cells = [headerRow, columnsRow];

  // Create the block table from cells
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
