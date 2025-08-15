/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get all immediate children that may represent columns
  const children = Array.from(grid.children);

  // Identify logo image, navigation, and search blocks
  let logoContent = null;
  let navigationContent = null;
  let searchContent = null;

  children.forEach(child => {
    if (child.classList.contains('image')) {
      // Get the inner div containing the image/link, fallback to the child itself
      const inner = child.querySelector(':scope > div');
      logoContent = inner || child;
    } else if (child.classList.contains('navigation')) {
      // Get the nav element
      const nav = child.querySelector(':scope > nav');
      navigationContent = nav || child;
    } else if (child.classList.contains('search')) {
      // Get the section element
      const section = child.querySelector(':scope > section');
      searchContent = section || child;
    }
  });

  // Compose columns row
  // Keep the order: logo | navigation | search as per visual screenshot
  const columnsRow = [logoContent, navigationContent, searchContent].filter(Boolean);

  // If no columns, don't create a table
  if (columnsRow.length === 0) return;

  // The header row must be exactly one cell: ['Columns (columns2)']
  const cells = [
    ['Columns (columns2)'], // single cell header row
    columnsRow              // N cell row (one per column)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
