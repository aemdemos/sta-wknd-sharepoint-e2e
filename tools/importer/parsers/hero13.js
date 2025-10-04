/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row: must match block name exactly
  const headerRow = ['Hero (hero13)'];

  // Image row: reference the <img> element directly
  let imageElem = null;
  const imageWrap = teaser.querySelector('.cmp-teaser__image');
  if (imageWrap) {
    imageElem = imageWrap.querySelector('img');
  }
  const imageRow = [imageElem || ''];

  // Content row: always present, even if empty
  let contentElems = [];
  const contentWrap = teaser.querySelector('.cmp-teaser__content');
  if (contentWrap) {
    // Push all direct children (title, subheading, CTA, etc.)
    Array.from(contentWrap.children).forEach((child) => {
      contentElems.push(child);
    });
  }
  // If no content, use empty string
  const contentRow = [contentElems.length ? contentElems : ''];

  // Compose the table: always 3 rows (header, image, content)
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the block
  element.replaceWith(block);
}
