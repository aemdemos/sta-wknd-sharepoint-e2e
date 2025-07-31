/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the container with slides
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slide items
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Prepare block rows
  const cells = [];
  cells.push(['Carousel (carousel15)']); // Header must match exactly

  items.forEach(item => {
    // --- IMAGE CELL ---
    // Find the first img in this slide (mandatory per block definition)
    const img = item.querySelector('img');

    // --- TEXT CELL ---
    // Collect all text content except for the image
    // We'll collect all children of the slide except for the image wrapper
    let textElements = [];
    // 1. If there is an image container, skip it
    const imageContainer = item.querySelector('.image, [data-cmp-is="image"]');
    Array.from(item.children).forEach(child => {
      if (child !== imageContainer) {
        textElements.push(child);
      }
    });

    // 2. If the only child is the image, textElements will be empty
    // In this case, no text cell
    let textCell = '';
    // But if text elements exist and are not empty text nodes, use them
    if (textElements && textElements.length > 0) {
      // Remove empty text nodes and whitespace-only elements
      textElements = textElements.filter(el => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          // Keep if it contains non-whitespace text or child elements
          return el.textContent.trim() !== '' || el.children.length > 0;
        } else if (el.nodeType === Node.TEXT_NODE) {
          return el.textContent.trim() !== '';
        }
        return false;
      });
      if (textElements.length > 0) {
        textCell = textElements;
      }
    }

    // 3. If still nothing, check for text directly on the item (as text nodes not wrapped in elements)
    if (!textCell) {
      const directTextNodes = Array.from(item.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '');
      if (directTextNodes.length > 0) {
        textCell = directTextNodes;
      }
    }

    // Add the slide row ONLY if there is an image (block definition)
    if (img) {
      cells.push([
        img,
        textCell || ''
      ]);
    }
  });

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
