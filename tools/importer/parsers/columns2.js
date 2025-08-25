/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (holds the columns)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the immediate column elements (should be three: logo, nav, search)
  let logoCol = null, navCol = null, searchCol = null;
  const children = Array.from(grid.children);
  for (let child of children) {
    if (child.classList.contains('cmp-image--logo')) logoCol = child;
    else if (child.classList.contains('cmp-navigation--header')) navCol = child;
    else if (child.classList.contains('cmp-search--header')) searchCol = child;
  }

  // Build columns row
  const columns = [];
  if (logoCol) {
    const logoContent = logoCol.firstElementChild;
    columns.push(logoContent ? logoContent : '');
  }
  if (navCol) {
    const nav = navCol.querySelector('nav');
    columns.push(nav ? nav : '');
  }
  if (searchCol) {
    const searchSection = searchCol.querySelector('section');
    columns.push(searchSection ? searchSection : '');
  }
  if (columns.length === 0) return;

  // Header row: exactly one cell, per example
  const cells = [
    ['Columns (columns2)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
