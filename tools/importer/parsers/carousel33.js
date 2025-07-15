/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const rows = [['Carousel (carousel33)']];

  // Find the carousel root element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the carousel content wrapper
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find each slide
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    // Find the image element inside the slide
    let imgEl = null;
    const imageContainer = slide.querySelector('.image, .cmp-image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    if (!imgEl) return; // Image is required

    // Gather all text content that's not inside the image container
    // We'll include all elements that are not the image container
    const textNodes = [];
    for (const child of slide.children) {
      if (!child.classList.contains('image') && !child.classList.contains('cmp-image')) {
        textNodes.push(child);
      }
    }
    // Always provide a second cell, even if empty
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    } else {
      textCell = '';
    }
    rows.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
