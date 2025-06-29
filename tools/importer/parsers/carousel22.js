/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the cells array for the block table
  const cells = [["Carousel (carousel22)"]]; // Header row: must match requirement

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Select all slides/carousel items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Left cell: image (should be the <img> inside .cmp-teaser__image)
    let img = item.querySelector('.cmp-teaser__image img');
    // Fallback: any <img> inside this slide
    if (!img) img = item.querySelector('img');

    // Right cell: text content (should be .cmp-teaser__content)
    let textContent = item.querySelector('.cmp-teaser__content');

    // If textContent exists, use the element directly; else use empty string
    // If img does not exist, use empty string
    cells.push([
      img || '',
      textContent || ''
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
