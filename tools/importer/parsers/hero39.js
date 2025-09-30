/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image (background)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get the content (title, description, etc)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentContainer) {
    // Title (usually h2)
    const titleEl = contentContainer.querySelector('.cmp-teaser__title');
    if (titleEl) contentEls.push(titleEl);
    // Description (usually div > p)
    const descEl = contentContainer.querySelector('.cmp-teaser__description');
    if (descEl) contentEls.push(descEl);
  }

  // Table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
