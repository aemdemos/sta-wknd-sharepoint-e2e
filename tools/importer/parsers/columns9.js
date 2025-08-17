/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid containing all columns
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  for (const g of gridCandidates) {
    const image = g.querySelector('.image');
    const nav = g.querySelector('.navigation');
    const title = g.querySelector('.title');
    const btns = g.querySelector('.buildingblock');
    const text = g.querySelector('.text');
    if (image && nav && title && btns && text) {
      grid = g;
      break;
    }
  }
  if (!grid) {
    grid = gridCandidates[0];
  }

  // Get all direct children (top-level columns)
  const children = Array.from(grid.children);
  const logoDiv = children.find(c => c.classList.contains('image'));
  const navDiv = children.find(c => c.classList.contains('navigation'));
  const titleDiv = children.find(c => c.classList.contains('title'));
  const btnsDiv = children.find(c => c.classList.contains('buildingblock'));
  const textDiv = children.find(c => c.classList.contains('text'));

  // Compose right column (Follow Us + buttons)
  let rightColContent = [];
  if (titleDiv) rightColContent.push(titleDiv);
  if (btnsDiv) rightColContent.push(btnsDiv);
  // If both missing, push empty string for correct column count
  if (rightColContent.length === 0) rightColContent = [''];

  // Build the columns row, always 3 columns as per example structure
  // If any column missing, insert empty string
  const columnsRow = [
    logoDiv || '',
    navDiv || '',
    rightColContent
  ];

  // Block header row
  const headerRow = ['Columns (columns9)'];

  // Copyright/content row: text only, should be single cell spanning all columns
  const copyrightRow = [textDiv || ''];

  // Final table structure
  const cells = [
    headerRow,
    columnsRow,
    copyrightRow
  ];

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
