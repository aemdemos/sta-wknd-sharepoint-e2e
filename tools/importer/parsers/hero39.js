/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero (hero39)'];

  // Get background image for row 2
  // This is the img inside .cmp-teaser__image
  let imageEl = null;
  const imageSection = element.querySelector('.cmp-teaser__image');
  if (imageSection) {
    const img = imageSection.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // Get all hero text content for row 3 (title, desc, CTA)
  const contentEls = [];
  const contentSection = element.querySelector('.cmp-teaser__content');
  if (contentSection) {
    // Title (typically h2)
    const title = contentSection.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description (can be a div with paragraph)
    const desc = contentSection.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA (not present in this example, but could be .cmp-teaser__action or similar)
    // If needed, add logic for CTA here.
  }

  // Build table: header row, image row, content row
  const rows = [
    headerRow,
    [imageEl],
    [contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
