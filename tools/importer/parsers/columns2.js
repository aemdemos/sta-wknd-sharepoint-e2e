/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns container (aem-Grid)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo (image), nav, search
  const children = Array.from(grid.children);
  const colLogo = children.find((child) => child.classList.contains('image')) || '';
  const colNav = children.find((child) => child.classList.contains('navigation')) || '';
  const colSearch = children.find((child) => child.classList.contains('search')) || '';

  // The header row must be a single cell
  const cells = [
    ['Columns (columns2)'],
    [colLogo, colNav, colSearch]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
