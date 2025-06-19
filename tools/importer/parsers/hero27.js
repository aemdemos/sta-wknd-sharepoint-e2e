/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the image element for the Hero block (if present)
  let img = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  }

  // 2. Gather content for the text/cta block
  const content = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (content) {
    // Title: styled as a Heading (use h2 from source as is)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      contentNodes.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      contentNodes.push(desc);
    }
    // CTA (link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentNodes.push(cta);
    }
  }

  // Table: header row, image row, content row
  const cells = [
    ['Hero'],
    [img || ''],
    [contentNodes.length > 0 ? contentNodes : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
