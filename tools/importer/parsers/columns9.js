/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid with 12 columns
  function findMainGrid(el) {
    // Traverse down to deepest .aem-Grid--12 grid
    let grids = el.querySelectorAll('.aem-Grid.aem-Grid--12');
    if (!grids.length) {
      // fallback: just use element itself
      return Array.from(el.children);
    }
    return Array.from(grids[grids.length - 1].children);
  }

  // Get all columns from the main grid
  const columns = findMainGrid(element);

  // Identify each block piece
  // 1. Logo block
  const logoCol = columns.find(col => col.classList.contains('image'));
  // 2. Navigation block
  const navCol = columns.find(col => col.classList.contains('navigation'));
  // 3. Title block
  const titleCol = columns.find(col => col.classList.contains('title'));
  // 4. Social buttons block
  const socialCol = columns.find(col => col.classList.contains('buildingblock'));
  // 5. Footer text block
  const textCol = columns.find(col => col.classList.contains('text'));

  // Compose the first content cell: logo, navigation, title, social buttons
  const leftCell = [];
  if (logoCol) leftCell.push(logoCol);
  if (navCol) leftCell.push(navCol);
  if (titleCol) leftCell.push(titleCol);
  if (socialCol) leftCell.push(socialCol);

  // Compose the second content cell: all footer text
  const rightCell = [];
  if (textCol) rightCell.push(textCol);

  // Table header must match: Columns (columns9)
  const headerRow = ['Columns (columns9)'];
  // 2 columns for 2 cells (left: logo/nav/title/social, right: text)
  const contentRow = [leftCell, rightCell];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(block);
}
