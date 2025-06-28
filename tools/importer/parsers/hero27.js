/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly as given
  const headerRow = ['Hero (hero27)'];

  // 2. Image row: get the <img> if it exists
  let imageEl = '';
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // 3. Content row: preserve all relevant elements (title, description, CTA)
  const contentEls = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Use the h2 as the main heading if present
    const h2 = contentDiv.querySelector('.cmp-teaser__title');
    if (h2) contentEls.push(h2);
    // Add description if present
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // Add CTA if present
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentEls.push(cta);
  }

  // 4. Final cells array: each row is a single cell (1-column table)
  const cells = [
    headerRow,
    [imageEl],
    [contentEls]
  ];

  // 5. Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
