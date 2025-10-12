/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero5) block: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Background Image (optional)
  // Row 3: Title (heading), Subheading (optional), CTA (optional), Separator (hr if visually part of hero)

  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  let imageEl = null;
  let titleEl = null;

  if (teaser) {
    // Find image inside teaser
    const imageWrap = teaser.querySelector('.cmp-teaser__image');
    if (imageWrap) {
      imageEl = imageWrap.querySelector('img');
    }
    // Find heading inside teaser
    const contentWrap = teaser.querySelector('.cmp-teaser__content');
    if (contentWrap) {
      // Accept h1, h2, h3, etc.
      titleEl = contentWrap.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Find the separator <hr> (if visually part of hero)
  let hrEl = element.querySelector('.cmp-separator__horizontal-rule');
  if (!hrEl) {
    hrEl = element.querySelector('hr');
  }

  // Compose table rows
  const headerRow = ['Hero (hero5)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose content row: title + separator (if present)
  const contentRow = [];
  if (titleEl) contentRow.push(titleEl);
  if (hrEl) contentRow.push(hrEl.cloneNode(true));
  if (contentRow.length === 0) contentRow.push('');

  const cells = [headerRow, imageRow, [contentRow]];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
