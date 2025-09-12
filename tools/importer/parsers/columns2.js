/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main grid inside the block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: image, navigation, search
  const imageCol = getChildByClass(grid, 'image');
  const navCol = getChildByClass(grid, 'navigation');
  const searchCol = getChildByClass(grid, 'search');

  // Defensive: If any are missing, fallback to empty
  // (imageCol and searchCol always present, navCol may be missing)

  // Get the image block (logo)
  let logoBlock = null;
  if (imageCol) {
    // The logo is the inner div with class 'cmp-image'
    logoBlock = getChildByClass(imageCol, 'cmp-image');
  }

  // Get the navigation block (may be missing)
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // Get the search block
  let searchBlock = null;
  if (searchCol) {
    // The search is the section with class 'cmp-search'
    searchBlock = searchCol.querySelector('section.cmp-search');
  }

  // Compose the columns for the block table
  // Always: logo | navigation | search
  // If navigation missing, just logo | search
  const columns = [];
  if (logoBlock) columns.push(logoBlock);
  if (navBlock) columns.push(navBlock);
  if (searchBlock) columns.push(searchBlock);

  // If navigation missing, only two columns
  if (!navBlock && columns.length === 3) {
    // Remove the empty nav column
    columns.splice(1, 1);
  }

  // Build the table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = columns;

  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
