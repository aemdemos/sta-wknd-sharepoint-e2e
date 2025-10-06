/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Column 1: Logo (image)
  const logoCol = findChildByClass(grid, 'image');
  let logoImg = null;
  if (logoCol) {
    logoImg = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Column 2: Navigation
  const navCol = findChildByClass(grid, 'navigation');
  let nav = null;
  if (navCol) {
    nav = navCol.querySelector('nav');
  }

  // Column 3: Title (Follow Us)
  const titleCol = findChildByClass(grid, 'title');
  let title = null;
  if (titleCol) {
    title = titleCol.querySelector('.cmp-title');
  }

  // Column 4: Social Buttons
  const btnCol = findChildByClass(grid, 'buildingblock');
  let btns = [];
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) {
      btns = Array.from(btnGrid.querySelectorAll('.cmp-button'));
    }
  }

  // Copyright and description text
  const textCol = findChildByClass(grid, 'text');
  let textBlock = null;
  if (textCol) {
    textBlock = textCol.querySelector('.cmp-text');
  }

  // Compose columns for the main row
  const columnsRow = [
    logoImg,
    nav,
    [title, ...btns],
  ];

  // Compose the footer row (copyright, description, etc)
  // Do NOT include separator (hr) unless Section Metadata table is present (not in this block)
  const footerRow = [textBlock];

  // Filter out any empty columns
  const mainCols = columnsRow.filter(Boolean);
  const footerCols = footerRow.filter(Boolean);

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const tableRows = [headerRow];
  tableRows.push(mainCols);
  tableRows.push(footerCols);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
