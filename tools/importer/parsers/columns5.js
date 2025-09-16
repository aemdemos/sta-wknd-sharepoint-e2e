/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Find logo image block
  const logoBlock = gridChildren.find(child => child.classList.contains('image'));
  // Find navigation block
  const navBlock = gridChildren.find(child => child.classList.contains('navigation'));
  // Find "Follow Us" title block
  const titleBlock = gridChildren.find(child => child.classList.contains('title'));
  // Find social buttons block
  const btnListBlock = gridChildren.find(child => child.classList.contains('cmp-buildingblock--btn-list'));
  // Find all text blocks (there are two)
  const textBlocks = gridChildren.filter(child => child.classList.contains('text'));

  // Defensive: ensure all required blocks are present
  if (!logoBlock || !navBlock || !titleBlock || !btnListBlock || textBlocks.length < 2) return;

  // Compose columns: visually, there are 3 columns
  // 1. Logo + navigation
  // 2. Follow Us + social buttons
  // 3. Footer text blocks
  const col1 = document.createElement('div');
  col1.appendChild(logoBlock);
  col1.appendChild(navBlock);

  const col2 = document.createElement('div');
  col2.appendChild(titleBlock);
  col2.appendChild(btnListBlock);

  const col3 = document.createElement('div');
  textBlocks.forEach(tb => col3.appendChild(tb));

  // Table header must match block name exactly
  const headerRow = ['Columns (columns5)'];
  // Table content row: each column is a div containing the referenced elements
  const contentRow = [col1, col2, col3];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
