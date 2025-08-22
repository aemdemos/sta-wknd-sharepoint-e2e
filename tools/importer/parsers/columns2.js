/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid element that contains the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the direct children of the grid that will make up the columns
  const columns = Array.from(grid.children);

  // We'll make the block with three columns: logo, navigation, search
  // Extract:
  // - logo: first column with .cmp-image--logo, use its main child (the image div)
  // - navigation: column with .cmp-navigation--header, use its <nav>
  // - search: column with .cmp-search--header, use its <section>

  let logoCell = null;
  let navCell = null;
  let searchCell = null;

  columns.forEach(col => {
    if (!logoCell && col.classList.contains('cmp-image--logo')) {
      // Use the image div (should be only child)
      const imgDiv = col.querySelector('[data-cmp-is="image"]');
      if (imgDiv) logoCell = imgDiv;
    } else if (!navCell && col.classList.contains('cmp-navigation--header')) {
      // Use the <nav>
      const nav = col.querySelector('nav');
      if (nav) navCell = nav;
    } else if (!searchCell && col.classList.contains('cmp-search--header')) {
      // Use the <section>
      const search = col.querySelector('section');
      if (search) searchCell = search;
    }
  });

  // Only include non-null columns (handle edge cases)
  const contentRow = [logoCell, navCell, searchCell].filter(Boolean);
  if (contentRow.length === 0) return; // Nothing to output

  // Prepare the block header as a single cell (even if there are multiple columns)
  const headerRow = ['Columns (columns2)'];

  // Build the table cells: each row is an array, first row is header (single cell), second is columns
  const cells = [headerRow, contentRow];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
