/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header
  const headerRow = ['Hero (hero39)'];

  // --------- IMAGE ROW ---------
  // Try to find the background image
  let imageCell = null;
  // The image is inside .cmp-teaser__image > [data-cmp-is="image"]
  const teaserImage = element.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (teaserImage) {
    imageCell = teaserImage;
  }

  // --------- CONTENT ROW ---------
  // We'll combine both title and description into a single cell, matching the markdown example
  let contentCell = null;
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // We want to keep the heading (h2) and description (div)
    const frag = document.createElement('div');
    const h2 = teaserContent.querySelector('h2');
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (h2) frag.appendChild(h2);
    if (desc) frag.appendChild(desc);
    contentCell = frag.children.length ? frag : null;
  }

  // Table rows (always 1 column)
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
