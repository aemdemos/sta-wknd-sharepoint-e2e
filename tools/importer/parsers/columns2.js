/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the three columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const cols = Array.from(grid.children);

  // 1. Logo (image)
  const logoCol = cols.find((c) => c.classList.contains('image'));
  let logoContent = '';
  if (logoCol) {
    const cmpImage = logoCol.querySelector('[data-cmp-is="image"]');
    if (cmpImage) {
      logoContent = cmpImage;
    }
  }

  // 2. Navigation (nav)
  const navCol = cols.find((c) => c.classList.contains('navigation'));
  let navContent = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) {
      navContent = nav;
    }
  }

  // 3. Search (section)
  const searchCol = cols.find((c) => c.classList.contains('search'));
  let searchContent = '';
  if (searchCol) {
    const search = searchCol.querySelector('section');
    if (search) {
      searchContent = search;
    }
  }

  // Table header
  const headerRow = ['Columns (columns2)'];
  // Table content row: logo | nav | search
  const contentRow = [logoContent, navContent, searchContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
