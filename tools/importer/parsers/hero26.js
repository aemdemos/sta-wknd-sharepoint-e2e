/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image element (first <img> in .cmp-teaser__image)
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Extract content: title, description, CTA
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Title: as heading (should maintain heading level/semantics)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);

    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);

    // CTA
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Construct the block table following the example structure (3 rows, 1 column)
  // Header row must read exactly: 'Hero'
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentParts]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
