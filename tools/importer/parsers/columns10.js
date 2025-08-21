/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid inside the footer (contains the columns)
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;

  // Prepare the content columns in display order
  // 1. Logo image (image/logo)
  const logoCol = mainGrid.querySelector('.image.cmp-image--logo');
  // 2. Navigation (nav)
  const navCol = mainGrid.querySelector('.navigation.cmp-navigation--footer');
  let navBlock = null;
  if (navCol) {
    // Use nav if present, otherwise navCol
    navBlock = navCol.querySelector('nav') || navCol;
  }
  // 3. Follow us title
  const titleCol = mainGrid.querySelector('.title.cmp-title--right');
  // 4. Social buttons
  const buttonsCol = mainGrid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  // 5. Copyright text
  const textCol = mainGrid.querySelector('.text.cmp-text--font-xsmall');

  // Build up the columns for the row, referencing existing elements only
  // Only columns with content will be included
  const columns = [];
  if (logoCol) columns.push(logoCol);
  if (navBlock) columns.push(navBlock);
  if (titleCol) columns.push(titleCol);
  if (buttonsCol) columns.push(buttonsCol);
  if (textCol) columns.push(textCol);

  if (columns.length < 2) return; // At least two columns expected for a columns block

  // Table header must match the block spec exactly, as a single cell
  const headerRow = ['Columns (columns10)'];
  const cells = [headerRow, [ ...columns ]]; // 2nd row: columns as individual cells

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
