/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Find logo image (first column)
  const logoCol = children.find((el) => el.classList.contains('image'));
  let logoContent = null;
  if (logoCol) {
    // Use the <img> or its parent <a> if present
    const logoLink = logoCol.querySelector('a');
    logoContent = logoLink || logoCol.querySelector('img');
  }

  // Find navigation (middle column)
  const navCol = children.find((el) => el.classList.contains('navigation'));
  let navContent = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    navContent = nav || navCol;
  }

  // Find search (last column)
  const searchCol = children.find((el) => el.classList.contains('search'));
  let searchContent = null;
  if (searchCol) {
    const search = searchCol.querySelector('section');
    searchContent = search || searchCol;
  }

  // Table header row
  const headerRow = ['Columns (columns2)'];
  // Table content row: 3 columns
  const contentRow = [logoContent, navContent, searchContent].map(cell => cell || '');

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace original element
  element.replaceWith(table);
}
