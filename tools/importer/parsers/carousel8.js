/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel root (.cmp-carousel)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) {
    carousel = element;
  }
  if (!carousel) return;

  // Find carousel items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  // Build slide rows: [image, text]
  const rows = Array.from(items).map(item => {
    // Get image from .image > .cmp-image > img
    let imageEl = '';
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      const cmpImage = imageContainer.querySelector('.cmp-image');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) imageEl = img;
      }
    }
    // Gather all non-image content for the text cell (robust for future text support)
    const textEls = [];
    Array.from(item.childNodes).forEach(child => {
      // Exclude image container
      if (!(child.nodeType === 1 && child.classList && child.classList.contains('image'))) {
        if (child.nodeType === 1) {
          // Only add non-empty elements
          if (child.textContent && child.textContent.trim().length > 0) {
            textEls.push(child);
          }
        } else if (child.nodeType === 3) {
          // Add non-empty text nodes
          if (child.textContent && child.textContent.trim().length > 0) {
            // Wrap text node in a span for safe table cell rendering
            const span = document.createElement('span');
            span.textContent = child.textContent.trim();
            textEls.push(span);
          }
        }
      }
    });
    const textCell = textEls.length > 0 ? textEls : '';
    return [imageEl, textCell];
  });

  // Header row: one cell only, per requirements
  const headerRow = ['Carousel (carousel8)'];

  // Final table: header row + slide rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
