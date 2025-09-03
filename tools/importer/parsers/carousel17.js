/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find carousel content container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides (direct children with class 'cmp-carousel__item')
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row: exactly one column
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find image element inside slide
    const imageWrapper = slide.querySelector('.image');
    let imgEl = null;
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    // Defensive: If no image, skip this slide
    if (!imgEl) return;

    // Find text content (if any)
    let textCell = null;
    let foundImage = false;
    const textNodes = [];
    slide.childNodes.forEach((node) => {
      if (node === imageWrapper) {
        foundImage = true;
        return;
      }
      if (foundImage) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textNodes.push(span);
        }
      }
    });
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      const frag = document.createDocumentFragment();
      textNodes.forEach(n => frag.appendChild(n));
      textCell = frag;
    }

    // Only push two columns if there is text content, otherwise just image
    if (textCell) {
      rows.push([imgEl, textCell]);
    } else {
      rows.push([imgEl]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
