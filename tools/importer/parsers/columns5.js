/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest container with the grid (footer content)
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--default--12');
  for (const candidate of gridCandidates) {
    if (
      candidate.querySelector('.cmp-image') &&
      candidate.querySelector('.cmp-navigation') &&
      candidate.querySelector('.cmp-title') &&
      candidate.querySelector('.cmp-button')
    ) {
      grid = candidate;
      break;
    }
  }
  if (!grid) return;

  // Get columns: logo, nav, follow us title, social buttons
  const columns = Array.from(grid.children).filter(col => (
    col.classList.contains('cmp-image--logo') ||
    col.classList.contains('cmp-navigation--footer') ||
    col.classList.contains('cmp-title--right') ||
    col.classList.contains('cmp-buildingblock--btn-list')
  ));

  let [logoCol, navCol, followCol, socialCol] = columns;
  if (!logoCol) logoCol = grid.querySelector('.cmp-image--logo');
  if (!navCol) navCol = grid.querySelector('.cmp-navigation--footer');
  if (!followCol) followCol = grid.querySelector('.cmp-title--right');
  if (!socialCol) socialCol = grid.querySelector('.cmp-buildingblock--btn-list');

  // Get the two text blocks at the bottom (after the grid)
  const allTextBlocks = Array.from(element.querySelectorAll('.cmp-text--font-xsmall.aem-GridColumn--default--12'));
  let text1, text2;
  if (allTextBlocks.length >= 2) {
    [text1, text2] = allTextBlocks;
  } else if (allTextBlocks.length === 1) {
    text1 = allTextBlocks[0];
  }

  const headerRow = ['Columns (columns5)'];
  const contentRow = [
    logoCol ? logoCol.querySelector('.cmp-image') : '',
    navCol ? navCol.querySelector('.cmp-navigation') : '',
    followCol ? followCol.querySelector('.cmp-title') : '',
    socialCol ? socialCol.querySelector('.aem-Grid') : '',
  ];
  while (contentRow.length < 4) contentRow.push('');

  // Only include text cells that have content (no empty columns)
  const textCells = [];
  if (text1 && text1.firstElementChild) textCells.push(text1.firstElementChild);
  if (text2 && text2.firstElementChild) textCells.push(text2.firstElementChild);

  const rows = [headerRow, contentRow];
  if (textCells.length) rows.push(textCells);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
