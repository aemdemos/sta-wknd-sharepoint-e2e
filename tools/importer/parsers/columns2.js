/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // The main grid container is always present
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  // Defensive: fallback to empty if not found
  const logoCol = getDirectChildByClass(grid, 'image');
  const navCol = getDirectChildByClass(grid, 'navigation');
  const searchCol = getDirectChildByClass(grid, 'search');

  // Each column content: use the first child (the actual content block)
  const logoContent = logoCol ? logoCol.firstElementChild : '';
  const navContent = navCol ? navCol.firstElementChild : '';
  const searchContent = searchCol ? searchCol.firstElementChild : '';

  // Compose the columns row: always 3 columns for this header layout
  const columnsRow = [
    logoContent ? logoContent : '',
    navContent ? navContent : '',
    searchContent ? searchContent : '',
  ];

  // Compose the table rows
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, columnsRow];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the element
  element.replaceWith(table);
}
