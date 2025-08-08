/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Carousel (carousel15)'];
  const rows = [];

  // Find the carousel root element
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  // Get the slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide is a .cmp-carousel__item
  const slides = content.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // First column: image (first <img> in the slide)
    const img = slide.querySelector('img');
    const imgCell = img || '';

    // Second column: all slide content except for the image container (.image)
    // We'll collect all elements not in the image container, preserving their structure
    const textNodes = [];
    slide.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        textNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // For non-empty text nodes outside the image, wrap in a <p>
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    // If no text content found, fallback to img.alt if available
    let textCell = '';
    if (textNodes.length > 0) {
      textCell = textNodes;
    } else if (img && img.alt) {
      const p = document.createElement('p');
      p.textContent = img.alt;
      textCell = p;
    }
    
    rows.push([imgCell, textCell]);
  });

  // Compose the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
