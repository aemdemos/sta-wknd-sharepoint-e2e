/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Only keep columns that have actual content (image, nav, or search)
  const contentColumns = columns.filter(col => {
    return col.querySelector('.cmp-image, nav.cmp-navigation, .cmp-search');
  });

  // For each column, extract the main content element (image, nav, or search)
  const cells = contentColumns.map(col => {
    const image = col.querySelector('.cmp-image');
    if (image) return image;
    const nav = col.querySelector('nav.cmp-navigation');
    if (nav) return nav;
    const search = col.querySelector('.cmp-search');
    if (search) return search;
    // fallback: return the column itself if nothing else
    return col;
  });

  // Build the table rows: header and one row with all columns
  const headerRow = ['Columns (columns2)'];
  const contentRow = cells;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
