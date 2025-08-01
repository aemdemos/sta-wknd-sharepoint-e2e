/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container in the element (the main content layout)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // The columns we care about are the direct children of the grid
  // Typically column order: logo, navigation, search
  const columns = Array.from(grid.children);

  // Find each main block by its distinct class
  const logoCol = columns.find(col => col.querySelector('.cmp-image'));
  const navCol = columns.find(col => col.querySelector('nav.cmp-navigation'));
  const searchCol = columns.find(col => col.querySelector('.cmp-search'));

  // Extract each block's main content element (not clones)
  const logoEl = logoCol ? logoCol.querySelector('.cmp-image') : '';
  const navEl = navCol ? navCol.querySelector('nav.cmp-navigation') : '';
  const searchEl = searchCol ? searchCol.querySelector('.cmp-search') : '';

  // Header must be a single cell (one column)
  const cells = [
    ['Columns (columns2)'], // Header row, exactly one cell
    [logoEl, navEl, searchEl], // Second row: three columns with content
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
