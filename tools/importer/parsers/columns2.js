/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main aem-Grid containing columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Collect the three logical columns: logo, navigation, search
  let logo = null;
  let navigation = null;
  let search = null;

  // Get logo (left)
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  if (logoCol && logoCol.firstElementChild) {
    logo = logoCol.firstElementChild;
  }

  // Get navigation (center)
  const navCol = grid.querySelector('.navigation.cmp-navigation--header');
  if (navCol && navCol.firstElementChild) {
    navigation = navCol.firstElementChild;
  }

  // Get search (right)
  const searchCol = grid.querySelector('.search.cmp-search--header');
  if (searchCol && searchCol.firstElementChild) {
    search = searchCol.firstElementChild;
  }

  // Build the columns row, only include found elements (in order: logo, navigation, search)
  const columnsRow = [logo, navigation, search].filter(Boolean);
  if (columnsRow.length === 0) return;

  // Header row: single column with block name
  const headerRow = ['Columns (columns2)'];

  // Compose the table: first row is header (single cell), second row is content (one cell per column)
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
