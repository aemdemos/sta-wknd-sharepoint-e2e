/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the direct child with a class containing a substring
  function findChildByClass(parent, classSubstr) {
    return Array.from(parent.children).find(child => child.className && child.className.includes(classSubstr));
  }

  // The main grid containing columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main columns: logo, navigation, search
  let logoCol = null;
  let navCol = null;
  let searchCol = null;
  Array.from(grid.children).forEach(child => {
    if (child.className && child.className.includes('image')) logoCol = child;
    else if (child.className && child.className.includes('navigation')) navCol = child;
    else if (child.className && child.className.includes('search')) searchCol = child;
  });

  // Defensive: logo and search must exist, nav is optional
  if (!logoCol || !searchCol) return;

  // Get the logo block (the inner .cmp-image)
  const logoBlock = findChildByClass(logoCol, 'cmp-image');
  // Get the navigation block (the inner nav), may be null
  const navBlock = navCol ? navCol.querySelector('nav') : null;
  // Get the search block (the inner section.cmp-search)
  const searchBlock = searchCol.querySelector('section.cmp-search');

  // Compose the columns for the block row
  // Always: logo, [navigation if present], search
  const columns = [logoBlock];
  if (navBlock) columns.push(navBlock);
  columns.push(searchBlock);

  // Compose the table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = columns;
  const tableArr = [headerRow, contentRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original element
  element.replaceWith(table);
}
