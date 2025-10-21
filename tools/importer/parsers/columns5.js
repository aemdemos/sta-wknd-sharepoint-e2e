/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container (where the columns live)
  let grid = element.querySelector('.aem-Grid');
  if (!grid) {
    grid = element.querySelector('[class*="aem-Grid"]');
  }
  if (!grid) return;

  // Get all top-level grid columns (these are the main columns)
  const columns = Array.from(grid.children).filter(col => col.nodeType === 1);

  // --- Extract columns content ---
  // 1. Logo (image)
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logo = null;
  if (logoCol) {
    const imgBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (imgBlock) logo = imgBlock;
    else {
      const img = logoCol.querySelector('img');
      if (img) logo = img;
    }
  }

  // 2. Navigation (either language or menu)
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navigation = null;
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) navigation = navBlock;
  }

  // 3. Follow Us title
  const titleCol = columns.find(col => col.classList.contains('title'));
  let followUs = null;
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) followUs = titleBlock;
  }

  // 4. Social buttons (Facebook, Twitter, Instagram)
  const btnCol = columns.find(col => col.classList.contains('buildingblock'));
  let socialBtns = [];
  if (btnCol) {
    socialBtns = Array.from(btnCol.querySelectorAll('a.cmp-button'));
  }

  // 5. Copyright and description text
  const textCol = columns.find(col => col.classList.contains('text'));
  let copyrightText = null;
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) copyrightText = textBlock;
  }

  // --- Compose table rows ---
  // Always use block name header
  const headerRow = ['Columns (columns5)'];

  // Compose columns row
  // Columns: logo, navigation, followUs+socialBtns (grouped together)
  let columnsRow;
  let numCols;
  let rightCol = [];
  if (followUs) rightCol.push(followUs);
  if (socialBtns.length) rightCol.push(...socialBtns);

  if (navigation) {
    columnsRow = [logo, navigation, rightCol];
    numCols = 3;
  } else {
    columnsRow = [logo, rightCol];
    numCols = 2;
  }

  // Copyright row (single cell spanning all columns)
  let copyrightRow = null;
  if (copyrightText) {
    copyrightRow = [copyrightText];
  }

  // Build table rows
  const tableRows = [headerRow, columnsRow];
  if (copyrightRow) tableRows.push(copyrightRow);

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // If copyright row exists, set colspan to span all columns
  if (copyrightRow) {
    const table = block;
    const lastRow = table.rows[table.rows.length - 1];
    if (lastRow.cells.length === 1 && numCols > 1) {
      lastRow.cells[0].setAttribute('colspan', numCols);
    }
  }

  // Replace original element
  element.replaceWith(block);
}
