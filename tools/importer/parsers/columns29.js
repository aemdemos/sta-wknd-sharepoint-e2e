/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content <main> (contains .cmp-contentfragment)
  const mainContent = Array.from(element.querySelectorAll(':scope > main')).find(m => m.querySelector('.cmp-contentfragment'));
  // Find the sidebar <aside>
  const sidebar = element.querySelector(':scope > aside');

  // The left column: main story content (not including the sidebar)
  // For robustness, use the innermost content container
  let leftCol = null;
  if (mainContent) {
    // Take the first .cmp-container inside mainContent, or mainContent itself
    leftCol = mainContent.querySelector(':scope > .cmp-container') || mainContent;
  }
  // The right column: sidebar content (if it exists, prefer the .cmp-container, else aside itself)
  let rightCol = null;
  if (sidebar) {
    rightCol = sidebar.querySelector(':scope > .cmp-container') || sidebar;
  }

  // Ensure both columns exist for the columns layout
  // If there's no sidebar, use an empty div for the right col (to keep two columns)
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  const headerRow = ['Columns (columns29)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
