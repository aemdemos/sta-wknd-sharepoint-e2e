/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the innermost grid containing the footer columns
  function findFooterGrid(el) {
    let grids = el.querySelectorAll('.aem-Grid.aem-Grid--12');
    let lastGrid = null;
    grids.forEach((g) => {
      if (el.contains(g)) lastGrid = g;
    });
    return lastGrid;
  }

  const grid = findFooterGrid(element);
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children).filter((col) => {
    const classList = col.classList;
    return (
      classList.contains('image') ||
      classList.contains('navigation') ||
      classList.contains('title') ||
      classList.contains('buildingblock')
    );
  });

  // Compose left column: logo and navigation (Deutsch link)
  const logoCol = columns.find((col) => col.classList.contains('image'));
  const navCol = columns.find((col) => col.classList.contains('navigation'));
  let leftCol = document.createElement('div');
  if (logoCol) leftCol.appendChild(logoCol.cloneNode(true));
  if (navCol) leftCol.appendChild(navCol.cloneNode(true));

  // Compose right column: Follow Us + social icons
  let rightCol = document.createElement('div');
  const titleCol = columns.find((col) => col.classList.contains('title'));
  if (titleCol) {
    const titleText = titleCol.querySelector('.cmp-title__text');
    if (titleText) rightCol.appendChild(titleText.cloneNode(true));
  }
  const socialCol = columns.find((col) => col.classList.contains('buildingblock'));
  if (socialCol) {
    const buttons = socialCol.querySelectorAll('.cmp-button');
    buttons.forEach(btn => rightCol.appendChild(btn.cloneNode(true)));
  }

  // Find the text block (copyright/info), which is always after the grid
  let textBlock = null;
  let sibling = grid.nextElementSibling;
  while (sibling) {
    if (sibling.classList.contains('text')) {
      textBlock = sibling.querySelector('.cmp-text') || sibling;
      break;
    }
    sibling = sibling.nextElementSibling;
  }
  if (!textBlock) {
    const fallbackText = element.querySelector('.cmp-text');
    if (fallbackText) textBlock = fallbackText;
  }

  // Compose the table rows
  const headerRow = ['Columns (columns9)'];
  const columnsRow = [leftCol, rightCol];
  // Info row: copyright and description text in first column, second column contains nothing (no unnecessary empty columns)
  let infoRow = null;
  if (textBlock) {
    infoRow = [textBlock, ''];
  }

  // Create the table and replace the original element
  const tableRows = infoRow ? [headerRow, columnsRow, infoRow] : [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
