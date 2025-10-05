/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct grid children (columns)
  function getGridColumns(grid) {
    return Array.from(grid.querySelectorAll(':scope > div'));
  }

  // Find the main grid inside the block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  const columns = getGridColumns(grid);

  // Defensive: find which is which by class
  let logoCol = columns.find(col => col.classList.contains('image'));
  let navCol = columns.find(col => col.classList.contains('navigation'));
  let searchCol = columns.find(col => col.classList.contains('search'));

  // Defensive fallback: if not found, use order
  if (!logoCol) logoCol = columns[0];
  if (!navCol) navCol = columns[1];
  if (!searchCol) searchCol = columns[2];

  // Extract logo (image inside link)
  let logoContent = '';
  if (logoCol) {
    const logoImgWrap = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoImgWrap) {
      logoContent = logoImgWrap;
    } else {
      logoContent = logoCol;
    }
  }

  // Extract navigation (nav element)
  let navContent = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) {
      navContent = nav;
    } else {
      navContent = navCol;
    }
  }

  // Extract search (section.cmp-search)
  let searchContent = '';
  if (searchCol) {
    const search = searchCol.querySelector('section.cmp-search');
    if (search) {
      searchContent = search;
    } else {
      searchContent = searchCol;
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoContent, navContent, searchContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
