/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area for the left column (the entire article area)
  const mainContent = element.querySelector('main.container.responsivegrid');
  let leftContent = '';
  if (mainContent) {
    leftContent = mainContent;
  }

  // Find the aside (sidebar) for the right column (the up next/related list)
  let rightContent = '';
  const aside = element.querySelector('aside.container.responsivegrid');
  if (aside) {
    // Up next is usually in the cmp-list
    const upNext = aside.querySelector('.cmp-list');
    if (upNext) {
      rightContent = upNext;
    }
  }

  // Table structure: header row must be a SINGLE cell, second row has 2 cells (columns)
  const headerRow = ['Columns']; // Exactly one column in header row
  const columnsRow = [leftContent, rightContent]; // Two columns in content row

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
