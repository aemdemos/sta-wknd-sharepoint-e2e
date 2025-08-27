/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing footer columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of grid
  const gridChildren = Array.from(grid.children);

  // Find logo (image block)
  const logoBlock = gridChildren.find(child => child.classList.contains('cmp-image--logo'));

  // Find navigation
  const navigationBlock = gridChildren.find(child => child.classList.contains('cmp-navigation--footer'));

  // Find "Follow Us" title
  const followBlock = gridChildren.find(child => child.classList.contains('cmp-title--right'));

  // Find social buttons
  const socialBlock = gridChildren.find(child => child.classList.contains('cmp-buildingblock--btn-list'));

  // Find copyright text
  const copyrightBlock = gridChildren.find(child => child.classList.contains('cmp-text--font-xsmall'));

  // Compose left column: logo + nav
  const leftCol = [];
  if (logoBlock) leftCol.push(logoBlock);
  if (navigationBlock) leftCol.push(navigationBlock);

  // Compose middle column: Follow Us + social buttons
  const middleCol = [];
  if (followBlock) middleCol.push(followBlock);
  if (socialBlock) middleCol.push(socialBlock);

  // Compose right column: copyright text
  const rightCol = [];
  if (copyrightBlock) rightCol.push(copyrightBlock);

  // Fallback for missing columns (should always be 3 for this layout)
  const columns = [leftCol.length ? leftCol : '', middleCol.length ? middleCol : '', rightCol.length ? rightCol : ''];

  // Table header must match example exactly: one cell only
  const headerRow = ['Columns (columns10)'];

  // Compose table: single header cell row, content row with 3 columns
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix header row to span all columns
  const th = table.querySelector('th');
  if (th) th.setAttribute('colspan', '3');

  element.replaceWith(table);
}
