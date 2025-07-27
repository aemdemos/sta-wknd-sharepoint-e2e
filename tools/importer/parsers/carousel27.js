/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row EXACTLY as in the example
  const headerRow = ['Carousel (carousel27)'];

  // Get the image (mandatory, first cell)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Text content (second cell): title, description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Title as heading
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA link
    const action = contentContainer.querySelector('.cmp-teaser__action-link');
    if (action) contentParts.push(action);
  }

  // Build rows array: header row, then slide row (image, text)
  const rows = [];
  rows.push(headerRow); // [ 'Carousel (carousel27)' ]
  rows.push([
    imageEl || '',
    contentParts.length > 0 ? contentParts : ''
  ]); // [image, [title, desc, cta]]

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
