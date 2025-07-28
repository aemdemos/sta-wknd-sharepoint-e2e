/* global WebImporter */
export default function parse(element, { document }) {
  function getTopGrid(el) {
    return el.querySelector('.aem-Grid');
  }
  function getColByPartialClass(grid, classPart) {
    return Array.from(grid.children).find(child => child.className && child.className.indexOf(classPart) !== -1);
  }
  const topGrid = getTopGrid(element);
  if (!topGrid) return;
  const logoCol = getColByPartialClass(topGrid, 'cmp-image--logo');
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }
  const navCol = getColByPartialClass(topGrid, 'cmp-navigation--footer');
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav.cmp-navigation');
  }
  const titleCol = getColByPartialClass(topGrid, 'cmp-title--right');
  let followBlock = null;
  if (titleCol) {
    followBlock = titleCol.querySelector('.cmp-title');
  }
  const btnCol = getColByPartialClass(topGrid, 'cmp-buildingblock--btn-list');
  let btnBlock = null;
  if (btnCol) {
    btnBlock = btnCol.querySelector('.aem-Grid');
  }
  const textBlocks = Array.from(topGrid.querySelectorAll('.cmp-text--font-xsmall > .cmp-text'));

  // --- FIX: Only two columns! ---
  // Create two container divs to group logo+nav and follow+btn as in the markdown example
  const firstColDiv = document.createElement('div');
  if (logoBlock) firstColDiv.appendChild(logoBlock);
  if (navBlock) firstColDiv.appendChild(navBlock);

  const secondColDiv = document.createElement('div');
  if (followBlock) secondColDiv.appendChild(followBlock);
  if (btnBlock) secondColDiv.appendChild(btnBlock);

  const headerRow = ['Columns (columns5)'];
  const columnsRow = [firstColDiv, secondColDiv]; // Only two columns
  const textRow = [textBlocks];
  const cells = [
    headerRow,
    columnsRow,
    textRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
