/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // HEADER ROW
  const headerRow = ['Hero (hero39)'];

  // IMAGE ROW
  let imageRow;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    // Find the image element
    imageEl = imageWrapper.querySelector('img');
  }
  imageRow = [imageEl ? imageEl : ''];

  // CONTENT ROW
  const contentParts = [];
  // Title (h2)
  const titleEl = teaser.querySelector('.cmp-teaser__title');
  if (titleEl) contentParts.push(titleEl);
  // Description (div > p)
  const descWrapper = teaser.querySelector('.cmp-teaser__description');
  if (descWrapper) {
    // Defensive: grab all children (could be <p>, <span>, etc)
    Array.from(descWrapper.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        contentParts.push(node);
      }
    });
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
