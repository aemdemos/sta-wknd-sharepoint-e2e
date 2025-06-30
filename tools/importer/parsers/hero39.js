/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, must match example exactly
  const headerRow = ['Hero (hero39)'];

  // Get the background image (if present)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // The row should still exist, even if no image is found (empty cell)
  const imageRow = [imageEl ? imageEl : ''];

  // Gather content (title, description, etc)
  let contentCellChildren = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (should be a heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentCellChildren.push(title);
    // Description (can be multiple p's, usually in .cmp-teaser__description)
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentCellChildren.push(description);
  }
  // The cell should still exist, even if empty
  const contentRow = [contentCellChildren.length > 0 ? contentCellChildren : ''];

  // Compose table
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
