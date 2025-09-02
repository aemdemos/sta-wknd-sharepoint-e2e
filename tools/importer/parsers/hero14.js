/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches the block name exactly
  const headerRow = ['Hero (hero14)'];

  // 2nd row: Background image (optional)
  // Find the main block image (do not clone, reference the existing IMG)
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3rd row: Text content (heading, description, and any CTA, in order, as elements)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentFragments = [];
  if (contentDiv) {
    // Heading (title)
    const heading = contentDiv.querySelector('.cmp-teaser__title');
    if (heading) contentFragments.push(heading);
    // Description
    const description = contentDiv.querySelector('.cmp-teaser__description');
    if (description) contentFragments.push(description);
    // CTA: none in this example, but if present, would be included here.
  }
  // If contentFragments is empty, put blank
  const contentRow = [contentFragments.length ? contentFragments : ''];

  // Build the table as specified
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the table
  element.replaceWith(table);
}
