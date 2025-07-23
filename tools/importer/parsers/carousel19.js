/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Prepare header row exactly as in the example
  const headerRow = ['Carousel (carousel19)'];

  // Build slide rows
  let twoColumns = false;
  const slideRows = Array.from(items).map((item) => {
    // Image cell: take the .cmp-image element (the actual image wrapper)
    const img = item.querySelector('.cmp-image');
    // Text cell: collect all children that are NOT the image block
    const contentEls = [];
    Array.from(item.children).forEach((child) => {
      // Exclude image wrapper
      if (!child.classList.contains('image')) {
        contentEls.push(child);
      }
    });
    // If any text content exists, mark as 2 columns
    if (contentEls.length > 0) twoColumns = true;
    // If text, use [img, [all content elements]]; otherwise just [img]
    return contentEls.length > 0 ? [img, contentEls] : [img];
  });

  // Structure rows accordingly
  const cells = [headerRow, ...slideRows.map(row => {
    if (twoColumns) {
      return [row[0], row[1] || ''];
    } else {
      return [row[0]];
    }
  })];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
