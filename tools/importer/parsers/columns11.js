/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest aem-Grid.aem-Grid--12 or similar grid inside the footer
  const grid = element.querySelector(
    '.aem-Grid.aem-Grid--12, .aem-Grid--tablet--12, .aem-Grid--default--12, .aem-Grid--phone--12'
  );
  if (!grid) return;

  // Identify columns from grid children
  const children = Array.from(grid.children);
  let logoCol = null, navCol = null, titleCol = null, socialCol = null;
  for (const child of children) {
    if (!logoCol && child.classList.contains('cmp-image--logo')) logoCol = child;
    else if (!navCol && child.classList.contains('cmp-navigation--footer')) navCol = child;
    else if (!titleCol && child.classList.contains('cmp-title--right')) titleCol = child;
    else if (!socialCol && child.classList.contains('cmp-buildingblock--btn-list')) socialCol = child;
  }

  // Bottom text is always the .cmp-text--font-xsmall block
  const textCol = grid.querySelector('.cmp-text--font-xsmall');

  // Compose columns: Col1 - logo, Col2 - navigation, Col3 - title + social buttons
  const rowCols = [];
  rowCols.push(logoCol ? logoCol : '');
  rowCols.push(navCol ? navCol : '');
  const thirdCol = [];
  if (titleCol) thirdCol.push(titleCol);
  if (socialCol) thirdCol.push(socialCol);
  rowCols.push(thirdCol.length ? thirdCol : '');

  // Compose the bottom row (copyright text) as three columns, text in first, empty for others
  const bottomRow = [textCol ? textCol : '', '', ''];

  const cells = [
    ['Columns'],
    rowCols,
    bottomRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
