/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  // Helper to gather all text content in a slide (excluding the image)
  function getTextContent(slide) {
    // Gather all nodes that are not inside '.image'
    const imageDiv = slide.querySelector('.image');
    const textNodes = Array.from(slide.childNodes).filter(node => {
      if (!imageDiv) return true;
      return node !== imageDiv;
    });
    // Flatten text content
    const result = [];
    textNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If it is a wrapper for text (could be div, span, etc.)
        result.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        result.push(p);
      }
    });
    return result.length === 0 ? '' : (result.length === 1 ? result[0] : result);
  }

  // Build rows
  const rows = [];
  // Header row must match the example, exactly one cell
  rows.push(['Carousel (carousel17)']);

  slides.forEach(slide => {
    // First cell: image (reference the actual 'img' element)
    const img = slide.querySelector('img');
    // Second cell: all text content outside the image
    const textContent = getTextContent(slide);
    rows.push([img || '', textContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set header colspan=2 if there are two columns
  const th = table.querySelector('tr:first-child th');
  if (th) th.setAttribute('colspan', '2');
  element.replaceWith(table);
}
