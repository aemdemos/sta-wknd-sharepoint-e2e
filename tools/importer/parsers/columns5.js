/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    // fallback: try to find any .aem-Grid inside element
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) {
    // fallback: use element itself
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Column 1: Logo
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoBlock = null;
  if (logoCol) {
    // Use the logo image/link block
    logoBlock = logoCol;
  }

  // Column 2: Navigation
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    navBlock = navCol;
  }

  // Column 3: Title (Follow Us)
  const titleCol = columns.find(col => col.classList.contains('title'));
  let titleBlock = null;
  if (titleCol) {
    titleBlock = titleCol;
  }

  // Column 4: Social Buttons
  const socialCol = columns.find(col => col.classList.contains('buildingblock'));
  let socialBlock = null;
  if (socialCol) {
    socialBlock = socialCol;
  }

  // Column 5: Footer Texts (all .text blocks)
  const textCols = columns.filter(col => col.classList.contains('text'));
  // Combine all text blocks into a single cell
  let textBlock = null;
  if (textCols.length > 0) {
    // Wrap all text blocks in a fragment
    const frag = document.createDocumentFragment();
    textCols.forEach(tc => frag.appendChild(tc));
    textBlock = frag;
  }

  // Compose the table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = [logoBlock, navBlock, titleBlock, socialBlock, textBlock];

  // Only include columns that exist (defensive)
  const filteredContentRow = contentRow.filter(Boolean);

  // If less than 5 columns, pad with empty string
  while (filteredContentRow.length < 5) {
    filteredContentRow.push('');
  }

  const cells = [headerRow, filteredContentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
