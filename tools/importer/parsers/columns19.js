/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract only meaningful content from a column root
  function extractColumnContent(colRoot) {
    if (!colRoot) return '';
    // Find the first .cmp-container inside colRoot
    const cmpContainer = colRoot.querySelector(':scope > .cmp-container');
    if (!cmpContainer) return '';
    // Only keep children that are contentful (text or images)
    const fragment = document.createDocumentFragment();
    Array.from(cmpContainer.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('img')) {
        fragment.appendChild(child.cloneNode(true));
      }
    });
    return fragment;
  }

  // Find the main content and sidebar columns
  const mainColumn = element.querySelector('main.container');
  const sidebarColumn = element.querySelector('aside.container');

  // Extract meaningful content for each column
  const mainContent = extractColumnContent(mainColumn);
  const sidebarContent = extractColumnContent(sidebarColumn);

  // Table structure: header row, then one row with two columns (main, sidebar)
  // The header row must have colspan matching the number of columns
  const headerRow = [document.createElement('span')];
  headerRow[0].textContent = 'Columns (columns19)';
  headerRow[0].setAttribute('colspan', '2');
  const contentRow = [mainContent, sidebarContent];
  const rows = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
