/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest aem-Grid (12 cols) - this is the main content grid
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  let grid = null;
  // Use the deepest grid (the last one found)
  if (grids && grids.length) {
    grid = grids[grids.length - 1];
  }
  if (!grid) return;

  // Get all direct child columns of the grid
  const columns = Array.from(grid.children);

  // From observation, extract columns by their classes
  let logo = null;
  let nav = null;
  let followUs = null;
  let socialLinks = null;
  let textBlocks = [];

  columns.forEach(col => {
    if (!logo && col.classList.contains('image')) {
      logo = col;
    } else if (!nav && col.classList.contains('navigation')) {
      nav = col;
    } else if (!followUs && col.classList.contains('title')) {
      followUs = col;
    } else if (!socialLinks && col.classList.contains('buildingblock')) {
      socialLinks = col;
    } else if (col.classList.contains('text')) {
      textBlocks.push(col);
    }
  });

  // Compose content fragments for the right-most column
  const rightCol = document.createDocumentFragment();
  // Text blocks: first block is the short text, remaining is the copyright/about (second block)
  textBlocks.forEach(tb => {
    rightCol.appendChild(tb);
  });

  // Compose the 'Follow Us' col
  const followCol = document.createDocumentFragment();
  if (followUs) followCol.appendChild(followUs);
  if (socialLinks) followCol.appendChild(socialLinks);

  // Compose the cells array for 4 columns
  const cells = [
    ['Columns (columns5)'],
    [logo, nav, followCol, rightCol]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
