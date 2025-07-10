/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article column (the article and title content)
  let mainColumn = null;
  const mainRegions = element.querySelectorAll('main.container.responsivegrid');
  if (mainRegions.length > 1) {
    mainColumn = mainRegions[1];
  } else if (mainRegions.length > 0) {
    mainColumn = mainRegions[0];
  }
  if (!mainColumn) mainColumn = null;

  // Byline/social column
  const bylineColumn = element.querySelector('.experiencefragment');
  // Sidebar column
  const sidebarColumn = element.querySelector('aside');

  // Compose the columns array (skip nulls, but maintain order)
  const columnsArr = [mainColumn, bylineColumn, sidebarColumn].map(col => col || '');

  // Header row is a single cell, not split across columns
  const headerRow = ['Columns (columns20)'];
  const contentRow = columnsArr;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
