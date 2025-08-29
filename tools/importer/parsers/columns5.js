/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Gather column elements by their semantic role
  let logoCol = '';
  let navCol = '';
  let searchCol = '';

  grid.childNodes.forEach((child) => {
    if (child.nodeType !== 1) return;
    if (child.classList.contains('image') && child.classList.contains('cmp-image--logo')) {
      // Prefer the <img> for logo image, but wrap in a div if needed (preserves semantic block for logo)
      const imgBlock = child.querySelector('[data-cmp-is="image"]');
      if (imgBlock) logoCol = imgBlock;
    } else if (child.classList.contains('navigation') && child.classList.contains('cmp-navigation--header')) {
      // Use the navigation <nav>
      const nav = child.querySelector('nav');
      if (nav) navCol = nav;
    } else if (child.classList.contains('search') && child.classList.contains('cmp-search--header')) {
      // Use the <section> for the search box
      const search = child.querySelector('section');
      if (search) searchCol = search;
    }
  });

  // Compose content as a row with each column
  // Only add columns that have content so the number of columns matches actual content
  const columnRow = [logoCol, navCol, searchCol];

  // The header row MUST be a single cell (spanning all columns in output)
  const headerRow = ['Columns (columns5)'];
  // Build the cells array as required: header single cell row, then one row containing all columns
  const cells = [headerRow, columnRow];

  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
