/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the first child with a class containing a substring
  function findChildByClass(parent, classSubstring) {
    return Array.from(parent.children).find(child => child.className && child.className.includes(classSubstring));
  }

  // Find the main grid container (aem-Grid)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  const logoCol = findChildByClass(grid, 'cmp-image--logo');
  const navCol = findChildByClass(grid, 'cmp-navigation--header');
  const searchCol = findChildByClass(grid, 'cmp-search--header');

  // Defensive: if any are missing, just skip that column
  const columns = [];
  if (logoCol) {
    // The logoCol contains a div.cmp-image, which contains the <a> and <img>
    const logoContent = logoCol.querySelector('.cmp-image');
    if (logoContent) columns.push(logoContent);
    else columns.push(logoCol);
  }
  if (navCol) {
    // The navCol contains the <nav> navigation
    const navContent = navCol.querySelector('nav');
    if (navContent) columns.push(navContent);
    else columns.push(navCol);
  }
  if (searchCol) {
    // The searchCol contains the <section> search
    const searchContent = searchCol.querySelector('section');
    if (searchContent) columns.push(searchContent);
    else columns.push(searchCol);
  }

  // Build the table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = columns;

  // Only create the block if there's at least one column
  if (contentRow.length > 0) {
    const cells = [headerRow, contentRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
