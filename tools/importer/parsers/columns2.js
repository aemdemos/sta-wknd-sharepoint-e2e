/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container in the block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get each of the three main columns by their role classes
  const columns = [
    Array.from(grid.children).find(el => el.classList.contains('image')),
    Array.from(grid.children).find(el => el.classList.contains('navigation')),
    Array.from(grid.children).find(el => el.classList.contains('search')),
  ];

  // For each column, reference the meaningful child element
  function extractColumnContent(col) {
    if (!col) return '';
    // Logo image: get the .cmp-image container
    if (col.classList.contains('image')) {
      const imgBlock = col.querySelector('.cmp-image');
      return imgBlock || '';
    }
    // Navigation: get the nav block
    if (col.classList.contains('navigation')) {
      const navElem = col.querySelector('nav');
      return navElem || '';
    }
    // Search: get the .cmp-search section
    if (col.classList.contains('search')) {
      const searchSection = col.querySelector('section.cmp-search');
      return searchSection || '';
    }
    return '';
  }

  const contentRow = columns.map(extractColumnContent);

  // Always ensure 3 columns, fill missing with ''
  while (contentRow.length < 3) contentRow.push('');

  // Block table header - CORRECTED: only one column in header
  const headerRow = ['Columns (columns2)'];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
