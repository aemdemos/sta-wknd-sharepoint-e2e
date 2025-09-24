/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract image (background image)
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  let imageCell = '';
  if (teaserImage) {
    imageCell = teaserImage;
  }

  // 2. Extract content (title, description, etc.)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentDiv) {
    // Use the actual contentDiv node so all formatting, headings, paragraphs are preserved
    contentCell = contentDiv;
  }

  // 3. Build the table rows
  const headerRow = ['Hero (hero18)']; // Must match block name exactly
  const imageRow = [imageCell];
  const contentRow = [contentCell];

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
