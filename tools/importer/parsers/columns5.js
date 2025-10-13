/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container with columns
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid--12, .aem-Grid--default--12');
  for (const candidate of gridCandidates) {
    if (
      candidate.querySelector('.cmp-image--logo') &&
      candidate.querySelector('.cmp-title--right') &&
      candidate.querySelector('.cmp-buildingblock--btn-list')
    ) {
      grid = candidate;
      break;
    }
  }
  if (!grid) return;

  // Get the three main columns: logo, navigation, social
  let logoCol = grid.querySelector('.cmp-image--logo');
  let navCol = grid.querySelector('.cmp-navigation--footer');
  let titleCol = grid.querySelector('.cmp-title--right');
  let btnCol = grid.querySelector('.cmp-buildingblock--btn-list');

  // Defensive: sometimes title and btnCol are in separate wrappers, sometimes together
  // We'll combine them for the right column
  let rightCol = document.createElement('div');
  if (titleCol) rightCol.appendChild(titleCol);
  if (btnCol) rightCol.appendChild(btnCol);

  // Compose the top row columns
  let columns = [];
  if (logoCol) columns.push(logoCol);
  if (navCol) columns.push(navCol);
  if (rightCol.childNodes.length) columns.push(rightCol);

  // Find separator (hr)
  let separator = grid.parentElement.querySelector('.cmp-separator__horizontal-rule');
  if (!separator) {
    separator = element.querySelector('.cmp-separator__horizontal-rule');
  }

  // Bottom row: copyright and description text
  let textCol = grid.parentElement.querySelector('.cmp-text--font-xsmall');
  if (!textCol) {
    textCol = element.querySelector('.cmp-text--font-xsmall');
  }

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Table body
  const bodyRows = [];
  // Top row: columns (logo, nav, right)
  bodyRows.push(columns);
  // Middle row: separator spanning all columns (same number of columns as top row)
  if (separator) {
    bodyRows.push(Array(columns.length).fill(separator));
  }
  // Bottom row: copyright and description spanning all columns (same number of columns as top row)
  if (textCol) {
    bodyRows.push(Array(columns.length).fill(textCol));
  }

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...bodyRows
  ], document);

  // Replace element
  element.replaceWith(table);
}
