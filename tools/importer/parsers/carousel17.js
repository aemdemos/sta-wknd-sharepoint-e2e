/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column as required
  const headerRow = ['Carousel (carousel17)'];
  const cells = [headerRow];

  // Find the carousel core element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // Image in slide
    const img = slide.querySelector('img');
    // All direct children of slide that are not the image wrapper
    const textParts = [];
    for (const child of slide.children) {
      if (!child.classList.contains('image')) {
        textParts.push(child);
      }
    }
    let textCell = '';
    if (textParts.length === 1) textCell = textParts[0];
    else if (textParts.length > 1) textCell = textParts;
    // Each row is a 2-column array (image, text). This will cause the table to have a header row with 1 col, then data rows with 2 cols, per requirements/example.
    cells.push([img, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
