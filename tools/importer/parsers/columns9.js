/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest grid container in the footer
  function findDeepestGrid(el) {
    let grid = null;
    const grids = el.querySelectorAll('.aem-Grid');
    grids.forEach((g) => {
      if (!grid || grid.contains(g)) grid = g;
    });
    return grid;
  }

  // Find the deepest grid container
  const grid = findDeepestGrid(element);
  if (!grid) return;

  // Get all direct children of the grid (these are the visual columns)
  const columns = Array.from(grid.children);

  // Prepare the header row
  const headerRow = ['Columns (columns9)'];

  // Prepare the columns for the second row
  // We'll group content by visual columns
  const contentRow = [];

  columns.forEach((col) => {
    // Defensive: skip hidden separators
    if (col.classList.contains('cmp-separator--hidden')) return;
    // Defensive: skip empty columns
    if (!col.textContent.trim() && !col.querySelector('img')) return;

    // For each column, grab all content blocks inside
    // Instead of picking just one child, collect all meaningful children
    let cells = [];
    // If column is a grid of buttons, collect all buttons
    if (col.querySelector('.cmp-button')) {
      const buttons = Array.from(col.querySelectorAll('.cmp-button'));
      if (buttons.length) {
        cells = cells.concat(buttons);
      }
    }
    // If column contains a navigation, include the nav
    const nav = col.querySelector('nav');
    if (nav) cells.push(nav);
    // If column contains an image, include the image block
    const imgBlock = col.querySelector('.cmp-image');
    if (imgBlock) cells.push(imgBlock);
    // If column contains a title, include the title block
    const titleBlock = col.querySelector('.cmp-title');
    if (titleBlock) cells.push(titleBlock);
    // If column contains a text block, include the text block
    const textBlock = col.querySelector('.cmp-text');
    if (textBlock) cells.push(textBlock);
    // If no specific blocks found, fallback to column itself
    if (cells.length === 0) {
      // Defensive: Only push if there's content
      if (col.textContent.trim() || col.querySelector('img')) {
        cells.push(col);
      }
    }
    // If we found any blocks, group them in a fragment
    if (cells.length === 1) {
      contentRow.push(cells[0]);
    } else if (cells.length > 1) {
      const frag = document.createDocumentFragment();
      cells.forEach((c) => frag.appendChild(c.cloneNode(true)));
      contentRow.push(frag);
    }
  });

  // Compose the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
