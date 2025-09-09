/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid inside the container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (logo, navigation, search)
  const gridChildren = Array.from(grid.children);

  // Find logo/image block (usually first)
  const logoBlock = gridChildren.find(child => child.classList.contains('image'));
  // Find navigation block (may be missing on some variants)
  const navBlock = gridChildren.find(child => child.classList.contains('navigation'));
  // Find search block (usually last)
  const searchBlock = gridChildren.find(child => child.classList.contains('search'));

  // Compose the content row
  // Only include blocks that exist (defensive)
  const content = [];
  if (logoBlock) content.push(logoBlock);
  if (navBlock) content.push(navBlock);
  if (searchBlock) content.push(searchBlock);

  // Table header as required
  const headerRow = ['Table (striped, bordered, tableStripedBordered2)'];
  const tableRows = [headerRow, [content]];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
