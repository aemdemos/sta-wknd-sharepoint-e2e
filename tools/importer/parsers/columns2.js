/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Extract columns in order: logo, navigation, search
  const expectedClasses = [
    'cmp-image--logo',
    'cmp-navigation--header',
    'cmp-search--header',
  ];
  const columns = expectedClasses.map(cls => {
    return Array.from(grid.children).find(ch => ch.classList.contains(cls)) || '';
  });

  // The header row must be a single cell
  const headerRow = ['Columns (columns2)'];

  // The second row is one cell per column
  const secondRow = columns;

  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
