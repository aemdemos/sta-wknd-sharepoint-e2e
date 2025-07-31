/* global WebImporter */
export default function parse(element, { document }) {
  // Safety: make sure we work only with the provided element
  // 1. Find the first .aem-Grid.aem-Grid--12 inside the footer (main content grid)
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // 2. Extract the 4 columns (logo, navigation, title, social buttons)
  // These columns are always present in the same order in the markup
  // We'll extract the inner content of each relevant block in order.

  // First column: logo
  let logoContent = '';
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  if (logoCol) {
    const logoInner = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoInner) logoContent = logoInner;
    else logoContent = logoCol;
  }

  // Second column: navigation
  let navContent = '';
  const navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  if (navCol) {
    const nav = navCol.querySelector('nav.cmp-navigation');
    if (nav) navContent = nav;
    else navContent = navCol;
  }

  // Third column: title
  let titleContent = '';
  const titleCol = grid.querySelector('.title.cmp-title--right');
  if (titleCol) {
    const titleInner = titleCol.querySelector('.cmp-title');
    if (titleInner) titleContent = titleInner;
    else titleContent = titleCol;
  }

  // Fourth column: social buttons
  let btnsContent = '';
  const btnsCol = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  if (btnsCol) {
    const btnsInner = btnsCol.querySelector('.aem-Grid.xf-master-building-block');
    if (btnsInner) btnsContent = btnsInner;
    else btnsContent = btnsCol;
  }

  // Compose the columns for the content row
  const columns = [logoContent, navContent, titleContent, btnsContent];

  // 3. Extract the text blocks after the grid as additional rows (if any)
  // Find all immediate .text.cmp-text--font-xsmall descendants of the grid's parent
  // (they are direct children of the .aem-Grid, but after the main grid block)
  // However, in the provided markup, they're siblings of grid.
  // Actually in the markup, they're in the same .aem-Grid as the columns, so just take them from the parent of grid.

  let textBlocks = [];
  // Find all .text.cmp-text--font-xsmall that are siblings of grid or children of the same parent
  const gridParent = grid.parentElement;
  if (gridParent) {
    textBlocks = Array.from(gridParent.querySelectorAll(':scope > .text.cmp-text--font-xsmall'));
  }
  // If none found, also check globally under element (edge case)
  if (textBlocks.length === 0) {
    textBlocks = Array.from(element.querySelectorAll('.text.cmp-text--font-xsmall'));
  }

  // Build extra rows for each text block
  const extraRows = textBlocks.map(tb => [tb]);

  // Table header must match example exactly
  const cells = [
    ['Columns (columns5)'],
    columns,
    ...extraRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
