/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Find the columns we care about
  const logoCol = children.find((child) => child.className.includes('image'));
  const navCol = children.find((child) => child.className.includes('navigation'));
  const searchCol = children.find((child) => child.className.includes('search'));

  // Left column: logo
  const leftCol = logoCol || document.createElement('div');
  // Right column: navigation and search combined
  const rightCol = document.createElement('div');
  if (navCol) rightCol.appendChild(navCol);
  if (searchCol) rightCol.appendChild(searchCol);

  // Build the two-column table
  const cells = [
    ['Columns (columns2)'],
    [leftCol, rightCol]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
