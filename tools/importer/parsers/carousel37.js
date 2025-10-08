/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Carousel (carousel37)'];

  // Find carousel slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Each slide is a direct child with class 'cmp-carousel__item'
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build rows for each slide
  const rows = slideEls.map(slide => {
    // Find image (mandatory)
    const imgEl = slide.querySelector('.image .cmp-image img');
    if (!imgEl) return null;
    // Only image in the slide, no visible text content
    return [imgEl];
  }).filter(Boolean);

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
