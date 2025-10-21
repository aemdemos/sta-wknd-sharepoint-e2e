/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns2)'];

  // Get the main grid container (holds logo, navigation, search)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (logo, navigation, search)
  const columns = Array.from(grid.children);

  // Find the logo block (image)
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoContent = '';
  if (logoCol) {
    // Use the logo image/link block as-is
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoBlock) logoContent = logoBlock;
    else logoContent = logoCol;
  }

  // Find the navigation block
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navContent = '';
  if (navCol) {
    // Use the navigation <nav> as-is
    const navBlock = navCol.querySelector('nav');
    if (navBlock) navContent = navBlock;
    else navContent = navCol;
  }

  // Find the search block
  const searchCol = columns.find(col => col.classList.contains('search'));
  let searchContent = '';
  if (searchCol) {
    // Use the search <section> as-is
    const searchBlock = searchCol.querySelector('section');
    if (searchBlock) searchContent = searchBlock;
    else searchContent = searchCol;
  }

  // Compose the columns for the block
  // If navigation is present, use three columns: logo | navigation | search
  // If navigation is missing, use two columns: logo | search
  let contentRow;
  if (navContent) {
    contentRow = [logoContent, navContent, searchContent];
  } else {
    contentRow = [logoContent, searchContent];
  }

  // Build the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
