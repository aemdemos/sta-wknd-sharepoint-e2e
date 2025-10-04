/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container (footer > ... > aem-Grid)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the column blocks)
  const columns = Array.from(grid.children);

  // --- Column 1: Logo + Navigation ---
  const logoBlock = columns.find(col => col.classList.contains('image'));
  let logoEl = null;
  if (logoBlock) {
    logoEl = logoBlock.querySelector('[data-cmp-is="image"]');
  }
  const navBlock = columns.find(col => col.classList.contains('navigation'));
  let navEl = null;
  if (navBlock) {
    navEl = navBlock.querySelector('nav');
  }

  // --- Column 2: Follow Us + Social Buttons ---
  const titleBlock = columns.find(col => col.classList.contains('title'));
  let titleEl = null;
  if (titleBlock) {
    titleEl = titleBlock.querySelector('.cmp-title');
  }
  const btnListBlock = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  let btnListEl = null;
  if (btnListBlock) {
    btnListEl = btnListBlock.querySelector('.aem-Grid');
  }

  // --- Copyright & Description ---
  const textBlock = columns.find(col => col.classList.contains('text'));
  let textEl = null;
  if (textBlock) {
    textEl = textBlock.querySelector('.cmp-text');
  }

  // Compose table rows
  const headerRow = ['Columns (columns11)'];

  // First content row: two columns (logo+nav, follow+social)
  const firstCol = [];
  if (logoEl) firstCol.push(logoEl);
  if (navEl) firstCol.push(navEl);

  const secondCol = [];
  if (titleEl) secondCol.push(titleEl);
  if (btnListEl) secondCol.push(btnListEl);

  // Second content row: ONLY copyright+desc column
  // FIX: Remove unnecessary empty column
  const cells = [
    headerRow,
    [firstCol, secondCol],
  ];
  if (textEl) {
    cells.push([textEl]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
