/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children with a class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList && el.classList.contains(className));
  }

  // Find the deepest grid container (the one with the actual columns)
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    // Defensive fallback: try any .aem-Grid
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) {
    // If not found, just use the element itself
    grid = element;
  }

  // Get all top-level columns (logo, nav, social, etc.)
  const columns = Array.from(grid.children).filter(el => el.classList && (
    el.classList.contains('image') ||
    el.classList.contains('navigation') ||
    el.classList.contains('title') ||
    el.classList.contains('buildingblock')
  ));

  // 1. Logo column (image)
  const logoCol = columns.find(el => el.classList.contains('image'));
  let logoBlock = null;
  if (logoCol) {
    // Use the logo image link block
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // 2. Navigation column (nav)
  const navCol = columns.find(el => el.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // 3. Social column (title + buttons)
  const titleCol = columns.find(el => el.classList.contains('title'));
  let titleBlock = null;
  if (titleCol) {
    titleBlock = titleCol.querySelector('.cmp-title');
  }
  const socialCol = columns.find(el => el.classList.contains('buildingblock'));
  let socialBlock = null;
  if (socialCol) {
    socialBlock = socialCol.querySelector('.aem-Grid');
  }

  // Compose the social cell: title + buttons
  let socialCell = [];
  if (titleBlock) socialCell.push(titleBlock);
  if (socialBlock) socialCell.push(socialBlock);

  // 4. Footer text (all .cmp-text)
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));
  // Defensive: filter only direct children of grid or its descendants
  const footerTextCell = textBlocks.length ? textBlocks : [];

  // Table structure:
  // Header row: block name
  // Second row: logo | nav | social
  // Third row: footer text (spanning all columns)

  // Compose table rows
  const headerRow = ['Columns (columns9)'];
  const contentRow = [logoBlock, navBlock, socialCell];
  const footerRow = [footerTextCell]; // All text in one cell

  // Create table
  const cells = [headerRow, contentRow, footerRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
