/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Defensive: find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main columns: image, navigation, search
  const imageCol = findChildByClass(grid, 'image');
  const navCol = findChildByClass(grid, 'navigation');
  const searchCol = findChildByClass(grid, 'search');

  // Defensive: ensure imageCol and searchCol exist
  if (!imageCol || !searchCol) return;

  // For image column: get the logo image (prefer the <img> inside the <a>)
  let logoImg = null;
  const cmpImage = imageCol.querySelector('[data-cmp-is="image"]');
  if (cmpImage) {
    const logoLink = cmpImage.querySelector('a');
    if (logoLink && logoLink.querySelector('img')) {
      logoImg = logoLink.querySelector('img');
    } else if (cmpImage.querySelector('img')) {
      logoImg = cmpImage.querySelector('img');
    }
  }

  // For navigation column: get the navigation block (may be missing)
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // For search column: get the search section
  let searchBlock = null;
  searchBlock = searchCol.querySelector('section');

  // Compose the columns: always image, search; navigation if present
  let columnsRow;
  if (navBlock) {
    columnsRow = [logoImg, navBlock, searchBlock];
  } else {
    columnsRow = [logoImg, searchBlock];
  }

  // Table header
  const headerRow = ['Columns (columns2)'];
  const cells = [headerRow, columnsRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
