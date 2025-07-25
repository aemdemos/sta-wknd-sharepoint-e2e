/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - must match example exactly
  const headerRow = ['Hero (hero27)'];

  // Find main image element
  const imageContainer = element.querySelector('.cmp-teaser__image');
  let imageElem = '';
  if (imageContainer) {
    // Use the first img element as-is
    const img = imageContainer.querySelector('img');
    if (img) imageElem = img;
  }

  // Compose content cell for row 3
  const content = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (content) {
    // Title/Heading
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (subheading/paragraph)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA link (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Build cells array for createTable
  const cells = [
    headerRow,
    [imageElem],
    [contentParts]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
