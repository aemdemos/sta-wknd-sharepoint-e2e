/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Carousel (carousel32)'];
  const rows = [headerRow];

  // Defensive: find the carousel inner container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) {
    element.remove();
    return;
  }

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) {
    element.remove();
    return;
  }

  // Each slide is a .cmp-carousel__item
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  items.forEach((item) => {
    // Find image element inside the slide
    let img = item.querySelector('img');
    if (!img) return;
    // Only add the image in the row, since there is no visible text content
    rows.push([img]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
