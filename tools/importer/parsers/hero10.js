/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must match example exactly
  const headerRow = ['Hero (hero10)'];

  // Row 2: Background image (optional)
  let imageElem = '';
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) imageElem = img;
  }

  // Row 3: Content
  const contentCells = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title
    const titleElem = contentContainer.querySelector('.cmp-teaser__title');
    if (titleElem) {
      // Preserve heading level (usually h2)
      contentCells.push(titleElem);
    }
    // Description
    const descElem = contentContainer.querySelector('.cmp-teaser__description');
    if (descElem) {
      contentCells.push(descElem);
    }
    // CTA (if exists)
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const ctaElem = actionContainer.querySelector('a');
      if (ctaElem) {
        contentCells.push(ctaElem);
      }
    }
  }

  // Ensure at least an empty string if no content
  const thirdRow = contentCells.length ? [contentCells] : [''];

  // Create the table
  const cells = [
    headerRow,
    [imageElem],
    thirdRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
