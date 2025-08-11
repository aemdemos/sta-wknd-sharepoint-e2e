/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct grid children columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // We'll expect 3 columns: logo, navigation, search
  let logoContent = null;
  let navContent = null;
  let searchContent = null;

  columns.forEach(col => {
    if (col.classList.contains('cmp-image--logo')) {
      // Find the image block (logo)
      const cmpImage = col.querySelector('.cmp-image');
      if (cmpImage) logoContent = cmpImage;
    } else if (col.classList.contains('cmp-navigation--header')) {
      // Find the navigation block
      const nav = col.querySelector('nav.cmp-navigation');
      if (nav) navContent = nav;
    } else if (col.classList.contains('cmp-search--header')) {
      // Find the search block
      const search = col.querySelector('section.cmp-search');
      if (search) searchContent = search;
    }
  });

  // Table header must be a single column (one cell array)
  const headerRow = ['Columns (columns2)'];
  // Content row has as many columns as there is content
  const contentRow = [logoContent, navContent, searchContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
