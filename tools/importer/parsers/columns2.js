/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main columns: logo, navigation, search
  const columns = Array.from(grid.children).filter(col => col && col.children && col.children.length > 0);

  const contentRow = columns.map(col => {
    // Logo column: extract the image element only
    if (col.classList.contains('image')) {
      const img = col.querySelector('img');
      if (img) {
        return img.cloneNode(true);
      }
    }
    // Navigation column: extract all navigation links as elements only
    if (col.classList.contains('navigation')) {
      const nav = col.querySelector('nav');
      if (nav) {
        // Get all navigation links (including nested ones)
        const links = Array.from(nav.querySelectorAll('a'));
        const navFragment = document.createDocumentFragment();
        links.forEach(link => navFragment.appendChild(link.cloneNode(true)));
        return navFragment;
      }
    }
    // Search column: extract the search input and icon only
    if (col.classList.contains('search')) {
      const field = col.querySelector('.cmp-search__field');
      if (field) {
        return field.cloneNode(true);
      }
    }
    // Fallback: return all children
    const frag = document.createDocumentFragment();
    Array.from(col.children).forEach(child => frag.appendChild(child.cloneNode(true)));
    return frag;
  });

  // Build the table rows
  const rows = [
    ['Columns (columns2)'],
    contentRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
