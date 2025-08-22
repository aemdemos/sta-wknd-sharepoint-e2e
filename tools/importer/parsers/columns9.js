/* global WebImporter */
export default function parse(element, { document }) {
  // Get the innermost grid that contains all the footer columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Extract column elements
  const logo = grid.querySelector('.cmp-image--logo');
  const nav = grid.querySelector('.cmp-navigation--footer');
  const followUsTitle = grid.querySelector('.cmp-title--right');
  const socialBtns = grid.querySelector('.cmp-buildingblock--btn-list');
  const followSocial = document.createElement('div');
  if (followUsTitle) followSocial.appendChild(followUsTitle);
  if (socialBtns) followSocial.appendChild(socialBtns);

  // Compose the columns row (three columns)
  const columnsRow = [logo, nav, followSocial];

  // Legal/copyright row: should be a single cell ONLY
  const legalText = grid.querySelector('.cmp-text--font-xsmall');
  const copyrightRow = [legalText]; // Fix: only one cell, NO PAD

  // Table header row (single cell)
  const headerRow = ['Columns (columns9)'];

  // Compose table: header, columns, copyright
  const cells = [
    headerRow,
    columnsRow,
    copyrightRow // only one cell for legal/copyright row
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
