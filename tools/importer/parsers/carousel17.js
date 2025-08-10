/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const cells = [];

  // Header row - single cell as in the example
  cells.push(['Carousel (carousel17)']);

  slides.forEach((slide) => {
    // First cell: image (must always be present)
    const img = slide.querySelector('img');

    // Second cell: text content (if any). Should extract all content except the image container.
    const imageContainer = slide.querySelector('.image');
    const textNodes = Array.from(slide.childNodes).filter((node) => {
      // Exclude image container
      if (node === imageContainer) return false;
      // Keep non-empty text nodes or elements
      if (node.nodeType === 3 && node.textContent.trim() === '') return false;
      return true;
    });
    // If there is text content, use it; otherwise, use empty string
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }

    cells.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
