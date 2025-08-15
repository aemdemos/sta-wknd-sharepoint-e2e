/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block/component name EXACTLY as in example
  const headerRow = ['Carousel (carousel27)'];

  // 2. Extract: slide image (first column), and content (second column)
  let imageEl = null;
  // Find first image in .cmp-teaser__image
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageEl = teaserImage;
  }

  // Extract content for 2nd column: title (heading), description, CTA (link)
  const contentArr = [];
  const contentRoot = element.querySelector('.cmp-teaser__content');
  if (contentRoot) {
    // Heading (preserve heading level)
    const titleEl = contentRoot.querySelector('.cmp-teaser__title');
    if (titleEl) contentArr.push(titleEl);
    // Description
    const descEl = contentRoot.querySelector('.cmp-teaser__description');
    if (descEl) contentArr.push(descEl);
    // CTA link (bottom of cell)
    const ctaEl = contentRoot.querySelector('.cmp-teaser__action-link');
    if (ctaEl) contentArr.push(ctaEl);
  }

  // Build rows (header, then slide row)
  const rows = [headerRow];
  if (imageEl) {
    rows.push([
      imageEl,
      contentArr.length ? contentArr : ''
    ]);
  }

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
