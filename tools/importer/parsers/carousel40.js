/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Carousel (carousel40)'];

  // Defensive: find the image
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Defensive: collect all text and CTA content
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Pre-title (optional)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentParts.push(pretitle);
    // Title (optional, usually h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (optional)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA (optional)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Compose table rows: header then slide
  const cells = [
    headerRow,
    [imageEl, contentParts]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
