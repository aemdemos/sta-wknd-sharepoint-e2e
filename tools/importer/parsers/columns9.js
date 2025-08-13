/* global WebImporter */
export default function parse(element, { document }) {
  // Safely identify the deepest .aem-Grid with 12 columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Helper: get first direct child with class name in grid
  function getFirstChildWithClass(grid, className) {
    return Array.from(grid.children).find((child) => child.classList.contains(className));
  }

  // 1. Logo column (contains .cmp-image--logo)
  const logoCol = getFirstChildWithClass(grid, 'cmp-image--logo');

  // 2. Navigation column (contains .cmp-navigation--footer)
  const navCol = getFirstChildWithClass(grid, 'cmp-navigation--footer');

  // 3/4. Title and social buttons (contains .cmp-title--right and .cmp-buildingblock--btn-list)
  const titleCol = getFirstChildWithClass(grid, 'cmp-title--right');
  const buttonsCol = getFirstChildWithClass(grid, 'cmp-buildingblock--btn-list');

  // Compose Follow Us cell (title and buttons)
  const followUsCell = document.createElement('div');
  if (titleCol) followUsCell.appendChild(titleCol);
  if (buttonsCol) followUsCell.appendChild(buttonsCol);

  // Content row - each cell contains referenced content (or empty string if missing)
  const contentRow = [logoCol || '', navCol || '', followUsCell];

  // Find copyright/description text as the .cmp-text--font-xsmall block
  let copyrightCol = null;
  if (grid.parentElement) {
    const copyrightWrap = grid.parentElement.querySelector('.cmp-text--font-xsmall');
    if (copyrightWrap) {
      copyrightCol = copyrightWrap.querySelector('.cmp-text') || copyrightWrap;
    }
  }

  // Copyright row, matching the number of columns in contentRow
  const copyrightRow = copyrightCol ? [copyrightCol, '', ''] : null;

  // Compose table rows: header (single column), then content
  const rows = [];
  rows.push(['Columns (columns9)']); // header row, single cell
  rows.push(contentRow);
  if (copyrightRow) rows.push(copyrightRow);

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
