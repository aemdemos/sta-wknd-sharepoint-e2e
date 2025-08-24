/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified
  const headerRow = ['Columns (columns9)'];

  // Find the deepest .aem-Grid (should represent the footer columns)
  let grid = null;
  const gridCandidates = element.querySelectorAll('.aem-Grid');
  for (const g of gridCandidates) {
    if (g.classList.contains('aem-Grid--12')) {
      grid = g;
    }
  }
  if (!grid) return;

  // The footer content should be organized as a single row with multiple columns
  // (each cell contains the relevant content for a visual column)
  // Only VISIBLE, meaningful blocks (logo, nav, title, social, text) should be columns
  const contentRow = [];

  // Get all direct children of the grid that represent visible blocks
  const gridChildren = Array.from(grid.children).filter(el => el.nodeType === 1);

  for (const col of gridChildren) {
    // Image/logo
    if (col.classList.contains('image')) {
      const imageBlock = col.querySelector('[data-cmp-is="image"]');
      if (imageBlock) {
        contentRow.push(imageBlock);
        continue;
      }
    }
    // Navigation bar
    if (col.classList.contains('navigation')) {
      const nav = col.querySelector('nav');
      if (nav) {
        contentRow.push(nav);
        continue;
      }
    }
    // Follow Us title
    if (col.classList.contains('title')) {
      const titleBlock = col.querySelector('.cmp-title');
      if (titleBlock) {
        contentRow.push(titleBlock);
        continue;
      }
    }
    // Social buttons (buildingblock)
    if (col.classList.contains('buildingblock')) {
      const btnGrid = col.querySelector('.aem-Grid');
      if (btnGrid) {
        contentRow.push(btnGrid);
        continue;
      }
    }
    // Copyright and credits text
    if (col.classList.contains('text')) {
      const textBlock = col.querySelector('.cmp-text');
      if (textBlock) {
        contentRow.push(textBlock);
        continue;
      }
    }
    // Ignore separator blocks and any others
  }

  // The header is a single cell, the second row should have as many cells as visible columns (columns in the footer)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
