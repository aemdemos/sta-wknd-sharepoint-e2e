/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid container inside the block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Helper: Find direct descendant by class (first match)
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find((c) => c.classList.contains(className));
  }

  // 1st column: logo image
  const logoCol = findChildByClass(grid, 'image');
  let logoContent = null;
  if (logoCol) {
    const cmpImg = logoCol.querySelector('[data-cmp-is="image"]');
    if (cmpImg) logoContent = cmpImg;
  }

  // 2nd column: navigation block
  const navCol = findChildByClass(grid, 'navigation');
  let navContent = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // 3rd column: search block
  const searchCol = findChildByClass(grid, 'search');
  let searchContent = null;
  if (searchCol) {
    const search = searchCol.querySelector('section');
    if (search) searchContent = search;
  }

  // Compose the table rows
  // Ensure header row is a single column only
  const headerRow = ['Columns (columns2)'];
  const secondRow = [logoContent, navContent, searchContent];

  // Create the block table
  const rows = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // If the table header row has more than one cell, merge them into one cell
  // But our headerRow is always a single element, so this issue should be fixed
  element.replaceWith(table);
}
