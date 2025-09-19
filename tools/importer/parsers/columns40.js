/* global WebImporter */
export default function parse(element, { document }) {
  // Get the .cmp-teaser__content and .cmp-teaser__image elements
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');
  const img = imageContainer ? imageContainer.querySelector('img') : null;

  // Only proceed if both content and image exist
  if (!content || !img) return;

  // Table header
  const headerRow = ['Columns (columns40)'];
  // Table row: [content, image]
  const row = [content, img];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
