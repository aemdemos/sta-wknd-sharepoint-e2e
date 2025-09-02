/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main aem-Grid (the one with logo, nav, follow, buttons, text)
  function getMainGrid(el) {
    // Descend through the containers until we find the deepest aem-Grid with children
    let current = el;
    let grid = null;
    while (current) {
      grid = current.querySelector(':scope > .aem-Grid');
      if (!grid) break;
      current = grid;
    }
    return current && current.classList.contains('aem-Grid') ? current : null;
  }

  // Find the main grid containing all column blocks
  const mainGrid = getMainGrid(element);
  if (!mainGrid) return;

  // Get all direct children of the grid that are relevant columns
  const columns = Array.from(mainGrid.children).filter((child) => {
    const cls = child.className || '';
    return /image|navigation|title|buildingblock|text/.test(cls);
  });

  // Find content elements for each logical column
  // 1. Logo image
  let logoBlock = null;
  const logoCol = columns.find(col => col.classList.contains('image'));
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }
  // 2. Navigation menu (can have nested ul)
  let navBlock = null;
  const navCol = columns.find(col => col.classList.contains('navigation'));
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }
  // 3. Follow Us title
  let titleBlock = null;
  const titleCol = columns.find(col => col.classList.contains('title'));
  if (titleCol) {
    titleBlock = titleCol.querySelector('.cmp-title');
  }
  // 4. Social buttons
  let buttonsBlock = null;
  const buttonsCol = columns.find(col => col.classList.contains('buildingblock'));
  if (buttonsCol) {
    const btns = Array.from(buttonsCol.querySelectorAll('.cmp-button'));
    if (btns.length > 0) {
      // Reference all buttons in a div container
      const btnDiv = document.createElement('div');
      btns.forEach(btn => btnDiv.appendChild(btn));
      buttonsBlock = btnDiv;
    }
  }
  // 5. Copyright/Footer text
  let textBlock = null;
  const textCol = columns.find(col => col.classList.contains('text'));
  if (textCol) {
    // Only the content div inside
    textBlock = textCol.querySelector('.cmp-text');
  }

  // Compose the block table
  // Header row
  const headerRow = ['Columns (columns11)'];
  // First row: all four content blocks as columns
  const contentRow = [logoBlock, navBlock, titleBlock, buttonsBlock].filter(Boolean);
  // Copyright row: full-width copyright
  const textRow = [textBlock];

  // Only add contentRow if we have at least one main content column
  const cells = [headerRow];
  if (contentRow.length > 0) cells.push(contentRow);
  // Only add textRow if copyright/footer text exists
  if (textBlock) cells.push(textRow);

  // Create Columns block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
