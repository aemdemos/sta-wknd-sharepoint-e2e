/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Extract background image (optional)
  // The image is inside .cmp-teaser__image > [data-cmp-is="image"] > img
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Extract content: title, subheading (description), CTA (not present in this example)
  // Title: .cmp-teaser__title (h2)
  // Description: .cmp-teaser__description
  // CTA: not present in this example, but if found, should be included
  let contentParts = [];
  const titleEl = element.querySelector('.cmp-teaser__title');
  if (titleEl) {
    contentParts.push(titleEl);
  }
  const descEl = element.querySelector('.cmp-teaser__description');
  if (descEl) {
    contentParts.push(descEl);
  }
  // Look for CTA (anchor) inside content or image (not present in this example, but future-proof)
  let ctaEl = null;
  // Try to find any anchor inside the teaser content
  const possibleCtas = element.querySelectorAll('.cmp-teaser__content a, .cmp-teaser__description a, .cmp-teaser__title a');
  if (possibleCtas.length > 0) {
    ctaEl = possibleCtas[0];
    contentParts.push(ctaEl);
  }

  // 4. Build the table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts]
  ];

  // 5. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
