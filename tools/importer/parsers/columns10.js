/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the logo/nav/title/buttonlist structure
  let grid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const g of grids) {
    // Check if this grid contains all required blocks as its children
    const image = g.querySelector(':scope > .image');
    const nav = g.querySelector(':scope > .navigation');
    const title = g.querySelector(':scope > .title');
    const btnList = g.querySelector(':scope > .buildingblock');
    if (image && nav && title && btnList) {
      grid = g;
      break;
    }
  }
  if (!grid) return;

  // Extract columns: logo, navigation, follow us(title + buttons)
  const logoBlock = grid.querySelector(':scope > .image');
  const navBlock = grid.querySelector(':scope > .navigation');
  const titleBlock = grid.querySelector(':scope > .title');
  const btnListBlock = grid.querySelector(':scope > .buildingblock');

  // Compose the Follow Us column: title above buttons
  let followUsCol = [];
  if (titleBlock) followUsCol.push(titleBlock);
  if (btnListBlock) followUsCol.push(btnListBlock);

  // Compose the second row (columns)
  const columnsRow = [logoBlock, navBlock, followUsCol];

  // Get copyright/description content (should be the cmp-text block)
  const textBlock = element.querySelector('.cmp-text');
  // If not found, set to empty div (to keep row structure)
  const copyrightRow = [textBlock ? textBlock : document.createElement('div')];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns10)'],
    columnsRow,
    copyrightRow
  ], document);

  element.replaceWith(table);
}
