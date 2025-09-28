/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer layout
  function findDeepestGrid(el) {
    let grid = null;
    let current = el;
    while (current) {
      const next = current.querySelector('.aem-Grid');
      if (!next || next === grid) break;
      grid = next;
      current = grid;
    }
    return grid;
  }

  const grid = findDeepestGrid(element);
  if (!grid) return;

  // Get all direct children of the grid that are not separators
  const columns = Array.from(grid.children).filter((child) => {
    return !child.classList.contains('cmp-separator') && !child.classList.contains('separator');
  });

  // Compose visual columns with actual content only
  const cellsContent = [];

  // 1. Logo
  const logoCol = columns.find((col) => col.classList.contains('image'));
  if (logoCol) {
    const imgLink = logoCol.querySelector('a');
    if (imgLink) cellsContent.push(imgLink.cloneNode(true));
  }

  // 2. Navigation
  const navCol = columns.find((col) => col.classList.contains('navigation'));
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav && nav.innerHTML.trim()) cellsContent.push(nav.cloneNode(true));
  }

  // 3. Follow Us (title + social buttons)
  const titleCol = columns.find((col) => col.classList.contains('title'));
  const btnCol = columns.find((col) => col.classList.contains('buildingblock'));
  const followUsCol = [];
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title && title.innerHTML.trim()) followUsCol.push(title.cloneNode(true));
  }
  if (btnCol) {
    const btns = Array.from(btnCol.querySelectorAll('.cmp-button'));
    btns.forEach(btn => {
      if (btn.innerHTML.trim()) followUsCol.push(btn.cloneNode(true));
    });
  }
  if (followUsCol.length) cellsContent.push(followUsCol);

  // 4. Text (copyright/description)
  const textCol = columns.find((col) => col.classList.contains('text'));
  if (textCol) {
    const text = textCol.querySelector('.cmp-text');
    if (text && text.innerHTML.trim()) cellsContent.push(text.cloneNode(true));
  }

  // If no content, abort
  if (!cellsContent.length) return;

  const headerRow = ['Columns (columns10)'];
  const cells = [headerRow, cellsContent];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
