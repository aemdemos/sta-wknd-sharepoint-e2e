/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Hero (hero10)'];

  // 2nd row: the background image if present
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : '']; // if no image, empty cell

  // 3rd row: Title (h2), Description (div), CTA (a)
  const contentParts = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts.length ? contentParts : '']; // empty if missing

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
