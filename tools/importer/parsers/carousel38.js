/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const headerRow = ['Carousel (carousel38)'];
  const cells = [headerRow];

  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = content.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    // First cell: the image element (referenced, not cloned)
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // Second cell: All text content except for the image
    // Collect all elements that are not part of the image wrapper
    let textNodes = [];
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip image wrapper and direct img
        if (node.classList.contains('image') || node.tagName === 'IMG') return;
        // If it's an empty element, skip
        if (!node.textContent.trim()) return;
        textNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Only non-empty text nodes
        const trimmed = node.textContent.trim();
        if (trimmed) {
          // Wrap text in a <p> for structure
          const p = document.createElement('p');
          p.textContent = trimmed;
          textNodes.push(p);
        }
      }
    });
    // If no text nodes, make the cell empty string
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    cells.push([imageCell, textCell]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
