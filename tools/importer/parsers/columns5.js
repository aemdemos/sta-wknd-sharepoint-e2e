/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the columns
  function findFooterGrid(el) {
    let grids = el.querySelectorAll('.aem-Grid');
    let deepestGrid = null;
    let maxDepth = 0;
    grids.forEach(g => {
      let depth = 0;
      let parent = g.parentElement;
      while (parent && parent !== el) {
        depth++;
        parent = parent.parentElement;
      }
      if (depth > maxDepth) {
        maxDepth = depth;
        deepestGrid = g;
      }
    });
    return deepestGrid;
  }

  // Find the main grid for the footer columns
  const grid = findFooterGrid(element);
  if (!grid) return;

  // Get all direct children columns of the grid
  const columns = Array.from(grid.children).filter(child => child.nodeType === 1);

  // Find the logo+nav, social, and text blocks
  const logoCol = columns.find(col => col.classList.contains('image'));
  const navCol = columns.find(col => col.classList.contains('navigation'));
  const followTitleCol = columns.find(col => col.classList.contains('title'));
  const socialCol = columns.find(col => col.classList.contains('buildingblock'));
  const textBlocks = Array.from(element.querySelectorAll('.text'));

  // Compose left column: logo + nav
  const leftCol = [];
  if (logoCol) leftCol.push(logoCol.cloneNode(true));
  if (navCol) leftCol.push(navCol.cloneNode(true));

  // Compose middle column: follow us title + social buttons
  const midCol = [];
  if (followTitleCol) midCol.push(followTitleCol.cloneNode(true));
  if (socialCol) midCol.push(socialCol.cloneNode(true));

  // Compose right column: all text blocks (from .text, in order)
  const rightCol = textBlocks.map(tb => tb.cloneNode(true));

  // Compose the header row
  const headerRow = ['Columns (columns5)'];

  // Compose the content row: always three columns for correct layout
  const contentRow = [leftCol, midCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
