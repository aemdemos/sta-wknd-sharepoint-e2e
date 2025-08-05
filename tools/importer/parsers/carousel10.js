/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block (must match example exactly)
  const headerRow = ['Carousel (carousel10)'];

  // Select the slide image: .cmp-teaser__image img
  let imgEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Collect all text content for the slide
  const content = element.querySelector('.cmp-teaser__content');
  const contentChildren = [];
  if (content) {
    // Heading/title (keep heading level for semantics)
    const title = content.querySelector('h1, h2, h3, .cmp-teaser__title');
    if (title) contentChildren.push(title);
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentChildren.push(desc);
    // CTA link (if any)
    const cta = content.querySelector('.cmp-teaser__action-link, a');
    if (cta) contentChildren.push(cta);
  }

  // Compose rows (first: header, then each slide as a row)
  const rows = [headerRow];
  rows.push([
    imgEl,
    contentChildren
  ]);

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}