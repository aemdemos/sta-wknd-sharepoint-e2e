/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel17) block parsing
  // Header row: always block name
  const headerRow = ['Carousel (carousel17)'];

  // Helper to extract all slides from the carousel
  function extractSlides(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper to extract image from a slide
  function extractImage(slideEl) {
    const imageDiv = slideEl.querySelector('[data-cmp-is="image"]');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) return img;
    }
    const img = slideEl.querySelector('img');
    return img || null;
  }

  // Find all carousel blocks in the element
  let carousels = [];
  if (element.classList.contains('cmp-carousel')) {
    carousels = [element];
  } else {
    carousels = Array.from(element.querySelectorAll('.cmp-carousel'));
  }
  if (carousels.length === 0 && element.classList.contains('carousel')) {
    carousels = [element];
  }

  // Compose table rows
  const rows = [headerRow];

  carousels.forEach(carouselEl => {
    const slides = extractSlides(carouselEl);
    slides.forEach(slideEl => {
      const img = extractImage(slideEl);
      // Only include the image in the row if there is no visible text content
      rows.push([img || '']);
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
