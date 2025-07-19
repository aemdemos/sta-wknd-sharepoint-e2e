/* global WebImporter */
export default function parse(element, { document }) {
  // Extract image from teaser
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Extract content: title, description, and CTA in order
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Title (preserve heading level)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA (link)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Table structure: header, image, content
  const cells = [
    ['Hero (hero10)'],
    [imageEl ? imageEl : ''],
    [contentParts]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
