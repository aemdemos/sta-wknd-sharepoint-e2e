/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first '.aem-Grid.aem-Grid--12' grid inside the element
  function getMainGrid(root) {
    return root.querySelector('.aem-Grid.aem-Grid--12');
  }

  const grid = getMainGrid(element);
  if (!grid) return;

  // 1st Column: Logo
  let logo = null;
  const logoCol = grid.querySelector('.cmp-image--logo');
  if (logoCol) {
    logo = logoCol.querySelector('[data-cmp-is="image"]') || logoCol;
  }

  // 2nd Column: Navigation
  let nav = null;
  const navCol = grid.querySelector('.cmp-navigation--footer');
  if (navCol) {
    nav = navCol.querySelector('nav') || navCol;
  }

  // 3rd Column: Follow Us (Title + Social Buttons)
  let followUs = [];
  const titleCol = grid.querySelector('.cmp-title--right');
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title) followUs.push(title);
  }
  const socialBlockCol = grid.querySelector('.cmp-buildingblock--btn-list');
  if (socialBlockCol) {
    const socialBlock = socialBlockCol.querySelector('.aem-Grid');
    if (socialBlock) followUs.push(socialBlock);
  }

  // Collect all footer text blocks (usually 2: main + copyright)
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text--font-xsmall .cmp-text'));
  // If missing, don't error: skip empty blocks
  const textContent = textBlocks.length > 0 ? textBlocks : [];

  // Build table data
  const headerRow = ['Columns (columns5)'];
  const columnsRow = [logo, nav, followUs];
  const footerRow = [textContent];
  const cells = [headerRow, columnsRow, footerRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
