/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel17) block parsing
  // Header row as specified
  const headerRow = ['Carousel (carousel17)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build rows: each slide is a row, image in first cell, second cell always present (empty if no text)
  const rows = items.map(item => {
    const img = item.querySelector('img');
    if (!img) return null;
    // No visible text content, so second cell is empty
    return [img, ''];
  }).filter(Boolean);

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
