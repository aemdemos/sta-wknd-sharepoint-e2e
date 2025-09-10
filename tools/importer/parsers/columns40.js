/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the main content and image columns
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the content (right column)
  const content = teaser.querySelector('.cmp-teaser__content');
  // Get the image (left column)
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');

  // Defensive: ensure both columns exist
  if (!content || !imageWrapper) return;

  // Use the image element directly for the left column
  let imageEl = imageWrapper.querySelector('img');
  // If the image is wrapped in a div, use the whole wrapper for richer semantics
  let leftCol = imageWrapper;

  // For the right column, use the content block as-is
  let rightCol = content;

  // Build the table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [leftCol, rightCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
