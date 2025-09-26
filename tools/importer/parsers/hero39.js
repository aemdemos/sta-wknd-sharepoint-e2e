/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Image row: background image (optional)
  let imageRow = [''];
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageRow = [teaserImage.cloneNode(true)];
  }

  // 3. Content row: title, subheading, CTA
  let contentRow = [''];
  const contentParts = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title (h2)
    const title = teaserContent.querySelector('h2');
    if (title) contentParts.push(title.cloneNode(true));
    // Description (paragraph inside .cmp-teaser__description)
    const desc = teaserContent.querySelector('.cmp-teaser__description p');
    if (desc) contentParts.push(desc.cloneNode(true));
    // CTA (any link inside content)
    const cta = teaserContent.querySelector('a');
    if (cta) contentParts.push(cta.cloneNode(true));
    if (contentParts.length) {
      contentRow = [contentParts];
    }
  }

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
