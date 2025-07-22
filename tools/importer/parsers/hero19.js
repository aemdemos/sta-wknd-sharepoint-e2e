/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: exactly as in the markdown example
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row: Only the image, as an element (if any)
  let imgEl = null;
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }

  // 3. Content row: Heading, subheading, CTA (as in source, preserve hierarchy)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentContainer) {
    // The heading (could be h1, h2, etc)
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentElements.push(heading);
    // Subheading/description (as a block element)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentElements.push(desc);
    // Optional CTA/link (as-is)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentElements.push(cta);
  }

  // Table rows: 1 col, 3 rows (header, image, content)
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentElements.length ? contentElements : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
