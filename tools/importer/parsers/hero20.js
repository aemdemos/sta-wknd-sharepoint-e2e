/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row as in example
  const headerRow = ['Hero (hero20)'];

  // 2. Image row: background image is in .cmp-teaser__image .cmp-image img
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Content row: title (as heading), description, CTA
  const contentArr = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title: keep as heading (source is h2)
    const titleEl = contentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentArr.push(titleEl);
    }
    // Description: may be a div with text
    const descEl = contentDiv.querySelector('.cmp-teaser__description');
    if (descEl) {
      contentArr.push(descEl);
    }
    // CTA: anchor element
    const ctaEl = contentDiv.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      contentArr.push(ctaEl);
    }
  }

  // 4. Assemble table rows as in example (1 col, 3 rows)
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentArr.length ? contentArr : '']
  ];

  // 5. Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
