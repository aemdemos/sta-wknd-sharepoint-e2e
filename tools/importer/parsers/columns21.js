/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the two visual columns: image and content
  const imageCol = teaser.querySelector('.cmp-teaser__image');
  const contentCol = teaser.querySelector('.cmp-teaser__content');

  // Defensive: if either column is missing, fallback to the whole element
  let columnsRow;
  if (imageCol && contentCol) {
    columnsRow = [imageCol, contentCol];
  } else {
    columnsRow = [element];
  }

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns21)'];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
