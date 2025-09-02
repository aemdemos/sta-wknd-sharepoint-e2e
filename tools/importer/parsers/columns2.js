/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container with columns
  const container = element.querySelector('.cmp-container');
  if (!container) return;
  const grid = container.querySelector('.aem-Grid');
  if (!grid) return;

  // Find logo, nav, search columns
  const logoDiv = grid.querySelector('.image');
  const navDiv = grid.querySelector('.navigation');
  const searchDiv = grid.querySelector('.search');

  // Build the table rows so that header row has only ONE cell
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoDiv || '', navDiv || '', searchDiv || ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
