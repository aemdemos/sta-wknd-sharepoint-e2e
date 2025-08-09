/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (EXACT match)
  const headerRow = ['Hero (hero39)'];

  // 2. Image row: Get the hero image container (.cmp-teaser__image)
  const imageContainer = element.querySelector('.cmp-teaser__image');
  // If imageContainer is missing, pass null or empty string for that cell
  const imageRow = [imageContainer || ''];

  // 3. Content row: Title & description (reference both elements directly)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentCells = [];
  if (contentContainer) {
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentCells.push(title);
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentCells.push(description);
    // No CTA element in provided HTML; if present, would reference directly
  }
  // Use empty string if there's no content
  const contentRow = [contentCells.length ? contentCells : ''];

  // 4. Build the single block table (no Section Metadata block in example)
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with the new block table
  element.replaceWith(table);
}
