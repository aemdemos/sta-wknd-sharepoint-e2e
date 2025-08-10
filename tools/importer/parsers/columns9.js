/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with 12 columns (contains the three main footer columns)
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // 1st column: logo
  const logoCol = gridChildren.find(el => el.classList && el.className.includes('cmp-image--logo'));
  let logoBlock = logoCol ? logoCol.firstElementChild : '';

  // 2nd column: navigation
  const navCol = gridChildren.find(el => el.classList && el.className.includes('cmp-navigation--footer'));
  let navBlock = navCol ? navCol.querySelector('nav') : '';

  // 3rd column: follow us title and social buttons
  const titleCol = gridChildren.find(el => el.classList && el.className.includes('cmp-title--right'));
  const socialCol = gridChildren.find(el => el.classList && el.className.includes('cmp-buildingblock--btn-list'));
  const thirdCol = [];
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) thirdCol.push(titleBlock);
  }
  if (socialCol) {
    const socialButtons = Array.from(socialCol.querySelectorAll('a.cmp-button'));
    thirdCol.push(...socialButtons);
  }

  // Bottom copyright/info text (full block in a cell)
  let textBlock = null;
  const parentContainer = grid.parentElement;
  if (parentContainer) {
    textBlock = parentContainer.querySelector('.cmp-text--font-xsmall');
  }

  // Assemble table rows
  // Header row - ONE cell only
  const headerRow = ['Columns (columns9)'];
  // Data row - three columns
  const contentRow = [logoBlock, navBlock, thirdCol];
  const rows = [headerRow, contentRow];
  // Copyright/info row - three columns, text in 3rd col
  if (textBlock) rows.push(['', '', textBlock]);

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
