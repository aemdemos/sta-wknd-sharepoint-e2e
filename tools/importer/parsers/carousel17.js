/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Slides
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const cells = [['Carousel (carousel17)']]; // header row

  slides.forEach((slide) => {
    // Image: find in .image wrapper if present
    let imageCell = '';
    const imageWrapper = slide.querySelector('.image');
    if (imageWrapper) {
      const cmpImage = imageWrapper.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Text content: collect all elements that are NOT inside .image
    const textParts = [];
    Array.from(slide.childNodes).forEach((node) => {
      // Skip the .image wrapper
      if (node.nodeType === 1 && node.classList.contains('image')) return;
      if (node.nodeType === 1) {
        // Element node (heading, paragraph, etc.)
        textParts.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Non-empty text node
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textParts.push(span);
      }
    });
    // If textParts is empty, second column is empty string
    const textCell = textParts.length ? textParts : '';
    cells.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
