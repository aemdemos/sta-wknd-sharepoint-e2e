/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the two main columns visually (image | content)
  // The structure is: .cmp-teaser--featured > .cmp-teaser > (.cmp-teaser__content, .cmp-teaser__image)

  // Find the .cmp-teaser inside the block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the content and image columns
  const contentCol = teaser.querySelector('.cmp-teaser__content');
  const imageCol = teaser.querySelector('.cmp-teaser__image');

  // Defensive: ensure both columns exist
  if (!contentCol || !imageCol) return;

  // Table header as required
  const headerRow = ['Columns (columns20)'];

  // The order is: image | content (to match visual layout)
  const row = [imageCol, contentCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
