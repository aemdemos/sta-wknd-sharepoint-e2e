/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Carousel (carousel37)'];
  const cells = [headerRow];

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel slides
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  slides.forEach((slide) => {
    // First cell: image (required)
    const img = slide.querySelector('img');
    if (!img) return;

    // Second cell: text content (optional)
    let textContent = [];
    // Only include text content if present
    // Gather all heading, p, and a elements that are not inside the image div
    const imageDiv = slide.querySelector('.image');
    Array.from(slide.children).forEach((child) => {
      if (child !== imageDiv) {
        // Collect direct heading, paragraph, and a tags
        child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach(el => textContent.push(el));
        // If wrapper itself is heading, p, or a, add it too
        if (/^H\d|P|A$/i.test(child.tagName)) {
          textContent.push(child);
        }
      }
    });

    // If there's no text content, cell should be empty string (for proper two-column structure)
    cells.push([img, textContent.length > 0 ? textContent : '']);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
