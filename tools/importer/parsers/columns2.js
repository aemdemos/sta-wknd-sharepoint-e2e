/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the logo, navigation, search
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children columns (logo, nav, search)
  const gridChildren = Array.from(grid.children);
  let logoCol, navCol, searchCol;
  for (const child of gridChildren) {
    if (child.classList.contains('image')) {
      logoCol = child;
    } else if (child.classList.contains('navigation')) {
      navCol = child;
    } else if (child.classList.contains('search')) {
      searchCol = child;
    }
  }

  // Get logo image element (reference the .cmp-image parent for full block)
  let logoBlock = '';
  if (logoCol) {
    const cmpImage = logoCol.querySelector('.cmp-image');
    if (cmpImage) logoBlock = cmpImage;
  }

  // Get navigation block (nav element)
  let navBlock = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navBlock = nav;
  }

  // Get search block (section.cmp-search)
  let searchBlock = '';
  if (searchCol) {
    const search = searchCol.querySelector('section.cmp-search');
    if (search) searchBlock = search;
  }

  // The header row must be a single column per spec
  const headerRow = ['Columns (columns2)'];
  // The next row has as many columns as content is available (logo, nav, search)
  // Only include cells that actually have content, but always in the standard order
  const dataRow = [logoBlock, navBlock, searchBlock];
  // Optionally, if no navigation/search, just leave empty cell(s)

  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
