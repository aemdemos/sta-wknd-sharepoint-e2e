/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  let logoCol = null;
  let navCol = null;
  let searchCol = null;
  // Defensive: find by class substring
  Array.from(grid.children).forEach((child) => {
    if (child.className.includes('cmp-image--logo')) logoCol = child;
    else if (child.className.includes('cmp-navigation--header')) navCol = child;
    else if (child.className.includes('cmp-search--header')) searchCol = child;
  });

  // Defensive fallback: skip if logo or search missing
  if (!logoCol || !searchCol) return;

  // For navigation: allow it to be empty (some variants)

  // Extract the actual content blocks
  // Logo: the .cmp-image inside logoCol
  const logoBlock = logoCol.querySelector('.cmp-image');
  // Navigation: the <nav> inside navCol (if present)
  const navBlock = navCol ? navCol.querySelector('nav') : '';
  // Search: the <section> inside searchCol
  const searchBlock = searchCol.querySelector('section');

  // Compose columns: always 3 columns for visual balance
  const columns = [logoBlock, navBlock, searchBlock];

  // Build the table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = columns.map((col) => col || '');

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
