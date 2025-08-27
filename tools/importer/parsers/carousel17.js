/* global WebImporter */
export default function parse(element, { document }) {
  // The exact header row per example: one column
  const headerRow = ['Carousel (carousel17)'];

  // Locate carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide elements
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build slide rows: [image, text]
  const rows = slides.map((slide) => {
    // --- IMAGE cell ---
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // --- TEXT cell ---
    // Gather all headings, paragraphs, lists, links not inside image wrappers
    let textElements = [];
    const imageWrappers = Array.from(slide.querySelectorAll('.cmp-image, .image'));
    // Find all elements that may contain text not in image wrappers
    textElements = Array.from(slide.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul,ol,a,div')).filter(el => {
      return !el.closest('.cmp-image, .image') && el !== img && el.textContent.trim();
    });
    // If direct children not covered, try fallback (for content deeply nested)
    if (textElements.length === 0) {
      Array.from(slide.children).forEach(child => {
        if (!imageWrappers.includes(child) && child.textContent.trim()) {
          textElements.push(child);
        }
      });
    }
    const textCell = textElements.length ? textElements : '';
    return [imageCell, textCell];
  });

  // Compose block table: header row, then each slide row (2 columns)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
