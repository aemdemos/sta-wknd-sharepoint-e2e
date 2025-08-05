/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;
  const slideEls = Array.from(slidesContainer.querySelectorAll(':scope > .cmp-carousel__item'));

  const rows = slideEls.map(slideEl => {
    // --- IMAGE CELL ---
    let imgCell = '';
    // Find the nearest .image container or img element
    const imageWrapper = slideEl.querySelector('.image');
    if (imageWrapper) {
      imgCell = imageWrapper;
    } else {
      const imgEl = slideEl.querySelector('img');
      if (imgEl) imgCell = imgEl;
    }

    // --- TEXT CELL ---
    // Collect all children that are not .image, and all meaningful text
    let textCell = '';
    const textNodes = [];
    slideEl.childNodes.forEach(node => {
      // Exclude .image wrappers
      if (node.nodeType === 1 && !node.classList.contains('image')) {
        // Only add element nodes that are not the image container
        textNodes.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim().length) {
        // wrap stray text node in a <p> to maintain semantic structure
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    // Always provide a second cell, even if empty
    if (textNodes.length > 0) {
      textCell = textNodes;
    } else {
      textCell = '';
    }

    // Always return a two-column row
    return [imgCell, textCell];
  });

  // Always use the exact block name for the header, as a single-column row
  const headerRow = ['Carousel (carousel8)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
