/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel root and its items
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Helper to get the <img> from the .image container
  function getImage(slide) {
    const img = slide.querySelector('.image img');
    return img || null;
  }

  // Helper to robustly extract all non-image content for the text cell
  function getTextContent(slide) {
    // Collect all nodes except those inside .image
    const textNodes = [];
    for (const child of Array.from(slide.childNodes)) {
      // If child is an element and .image, skip
      if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('image')) continue;
      // If child is element or meaningful text node, keep
      if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0)) {
        textNodes.push(child);
      }
    }
    // If no element/text found, return empty string
    if (!textNodes.length) return '';
    // If only one, return it directly
    if (textNodes.length === 1) return textNodes[0];
    // If multiple, wrap in a <div>
    const wrapper = document.createElement('div');
    textNodes.forEach(n => wrapper.appendChild(n));
    return wrapper;
  }

  // Build the table structure
  const cells = [];
  // Header row: one cell, matches example exactly
  cells.push(['Carousel (carousel18)']);

  slides.forEach(slide => {
    const img = getImage(slide);
    const textContent = getTextContent(slide);
    cells.push([img || '', textContent || '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
