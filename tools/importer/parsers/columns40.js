/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: left (image), right (content)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Right column: content
  let contentCol = null;
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    contentCol = contentWrapper;
  }

  // Left column: image
  let imageCol = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageCol = imageWrapper;
  }

  // Ensure both columns exist
  if (!imageCol && !contentCol) return;

  // The correct order is [content, image] to match the screenshot and block description
  const headerRow = ['Columns (columns40)'];
  const contentRow = [contentCol, imageCol];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
