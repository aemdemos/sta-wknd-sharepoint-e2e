/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel structure
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slides
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Header row as per example
  const cells = [['Carousel (carousel16)']];

  slides.forEach((slide) => {
    // IMAGE CELL: Find the first <img> in the slide
    let imgCell = '';
    const img = slide.querySelector('img');
    if (img) imgCell = img;

    // TEXT CELL: Extract all non-image text content
    let textCell = '';
    const textElements = [];
    // Get all elements inside slide (except image wrappers)
    function collectTextContent(node) {
      // If this subtree contains an <img>, skip this branch
      if (node.querySelector && node.querySelector('img')) return;
      // If element contains visible text, add it
      if (node.nodeType === 1) {
        // If it's a heading, paragraph, or link, keep whole element
        if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P' || node.tagName === 'A' || node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'LI' || node.tagName === 'DIV' || node.tagName === 'SPAN') {
          if (node.textContent.trim().length > 0) {
            textElements.push(node);
            return; // Don't go deeper; keep top element
          }
        }
        // Otherwise, traverse children
        Array.from(node.childNodes).forEach(collectTextContent);
      } else if (node.nodeType === 3) { // text node
        if (node.textContent.trim().length > 0) {
          // Wrap text node in a span
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textElements.push(span);
        }
      }
    }
    // Start from all children of slide that are not part of image wrappers
    Array.from(slide.childNodes).forEach((child) => {
      // Only skip if this is a wrapper that contains an image
      if (child.nodeType === 1 && child.querySelector && child.querySelector('img')) return;
      collectTextContent(child);
    });
    if (textElements.length > 0) {
      textCell = textElements;
    } else {
      textCell = '';
    }

    cells.push([imgCell, textCell]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
