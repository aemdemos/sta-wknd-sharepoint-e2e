/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the three columns
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const cont of grids) {
    if (
      cont.classList.contains('aem-Grid--12') &&
      cont.children.length >= 3 &&
      cont.querySelector('.cmp-image--logo') &&
      cont.querySelector('.cmp-navigation--footer') &&
      cont.querySelector('.cmp-title--right')
    ) {
      grid = cont;
      break;
    }
  }
  if (!grid) return;

  // First column: logo image
  const logoCol = grid.querySelector('.cmp-image--logo');
  let logoDiv = logoCol ? logoCol.querySelector('[data-cmp-is="image"]') : null;

  // Second column: navigation
  const navCol = grid.querySelector('.cmp-navigation--footer');
  let nav = navCol ? navCol.querySelector('nav') : null;

  // Third column: title + social buttons
  const titleCol = grid.querySelector('.cmp-title--right');
  let titleContent = titleCol ? titleCol.querySelector('.cmp-title') : null;

  // Social buttons appear in next sibling cmp-buildingblock--btn-list after titleCol
  let socialCol = null;
  let socialGrid = null;
  if (titleCol) {
    let parentGrid = titleCol.parentElement;
    for (let i = 0; i < parentGrid.children.length; i++) {
      if (parentGrid.children[i] === titleCol) {
        // Look forward for cmp-buildingblock--btn-list sibling
        for (let j = i + 1; j < parentGrid.children.length; j++) {
          if (
            parentGrid.children[j].classList &&
            parentGrid.children[j].classList.contains('cmp-buildingblock--btn-list')
          ) {
            socialCol = parentGrid.children[j];
            break;
          }
        }
        break;
      }
    }
  }
  if (socialCol) {
    socialGrid = socialCol.querySelector('.aem-Grid');
  }
  let socialBtns = [];
  if (socialGrid) {
    socialBtns = Array.from(socialGrid.querySelectorAll('.cmp-button'));
  }

  // Third column content (title + social)
  const thirdColumn = document.createElement('div');
  if (titleContent) thirdColumn.appendChild(titleContent);
  socialBtns.forEach(btn => thirdColumn.appendChild(btn));

  // Info row (footer text blocks)
  // Should be a single cell row (not split into three columns)
  let parentContainer = grid.parentElement;
  let textCols = Array.from(parentContainer.querySelectorAll('.cmp-text'));
  let infoDiv = null;
  if (textCols.length > 0) {
    infoDiv = document.createElement('div');
    textCols.forEach(t => infoDiv.appendChild(t));
  }

  // Build table rows to match markdown example:
  // 1. Header row: single cell, single column
  // 2. Three columns row: 3 cells
  // 3. Info row: single cell, single column
  const cells = [
    ['Columns (columns5)'],
    [logoDiv, nav, thirdColumn],
  ];
  if (infoDiv) {
    cells.push([infoDiv]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
