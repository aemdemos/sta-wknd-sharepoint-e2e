/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container with the actual content
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    // Exclude visually hidden separators
    if (col.classList.contains('cmp-separator--hidden')) return false;
    return true;
  });

  // Compose cells for each column, extracting all content
  const mainRow = columns.map(col => {
    // If it contains .cmp-text, use all children (to get all text and links)
    const cmpText = col.querySelector('.cmp-text');
    if (cmpText) {
      const frag = document.createElement('div');
      // Use innerHTML to ensure all text and links are included
      frag.innerHTML = cmpText.innerHTML;
      return frag;
    }
    // If it contains .cmp-title, use it
    const cmpTitle = col.querySelector('.cmp-title');
    if (cmpTitle) {
      return cmpTitle.cloneNode(true);
    }
    // If it contains .cmp-button, collect all buttons
    const buttons = col.querySelectorAll('.cmp-button');
    if (buttons.length) {
      const frag = document.createElement('div');
      buttons.forEach(btn => frag.appendChild(btn.cloneNode(true)));
      return frag;
    }
    // If it contains an image link
    const a = col.querySelector('a');
    if (a && a.querySelector('img')) {
      return a.cloneNode(true);
    }
    // If it contains nav
    const nav = col.querySelector('nav');
    if (nav) {
      return nav.cloneNode(true);
    }
    // Otherwise, clone the column itself
    return col.cloneNode(true);
  });

  // Copyright row (if present)
  let copyrightRow = null;
  const textCol = columns.find(col => col.classList.contains('text'));
  if (textCol) {
    const cmpText = textCol.querySelector('.cmp-text');
    if (cmpText) {
      const frag = document.createElement('div');
      frag.innerHTML = cmpText.innerHTML;
      // copyright row should have same number of columns
      copyrightRow = Array(mainRow.length).fill('');
      copyrightRow[0] = frag;
    }
  }

  const headerRow = ['Columns (columns10)'];
  const cells = [headerRow, mainRow];
  if (copyrightRow) cells.push(copyrightRow);
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
