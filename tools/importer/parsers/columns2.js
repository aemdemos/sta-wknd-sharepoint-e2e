/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the grid container (holds columns)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (each is a column)
  const columns = Array.from(grid.children);

  // For each column, extract the main content block
  // We want: logo/image, navigation (if present), search
  // Columns visually: [logo], [navigation], [search]

  // Find the logo/image column
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoContent = null;
  if (logoCol) {
    // Defensive: grab the image block (usually a div with data-cmp-is="image")
    logoContent = logoCol.querySelector('[data-cmp-is="image"]') || logoCol;
  }

  // Find the navigation column (may be missing)
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navContent = null;
  if (navCol) {
    // Defensive: grab the nav block
    navContent = navCol.querySelector('nav') || navCol;
  }

  // Find the search column
  const searchCol = columns.find(col => col.classList.contains('search'));
  let searchContent = null;
  if (searchCol) {
    // Defensive: grab the section block
    searchContent = searchCol.querySelector('section') || searchCol;
  }

  // Build the table header
  const headerRow = ['Columns (columns2)'];

  // Build the content row(s)
  // If navigation is present, use 3 columns; else, use 2 columns
  let contentRow;
  if (navContent) {
    contentRow = [logoContent, navContent, searchContent];
  } else {
    contentRow = [logoContent, searchContent];
  }

  // Defensive: filter out any nulls (shouldn't happen, but just in case)
  contentRow = contentRow.filter(Boolean);

  // Compose the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
