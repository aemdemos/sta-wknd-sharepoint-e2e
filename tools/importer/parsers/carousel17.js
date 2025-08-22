/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Carousel (carousel17)'];

  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Helper to extract all non-image content from a slide
  function extractTextContent(slide) {
    // Collect all children except elements with class 'image' or 'cmp-image'
    const nodes = [];
    Array.from(slide.childNodes).forEach(child => {
      if (
        child.nodeType === 1 &&
        !child.classList.contains('image') &&
        !child.classList.contains('cmp-image')
      ) {
        nodes.push(child);
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        // Wrap unwrapped text in <p> for safety
        const p = document.createElement('p');
        p.textContent = child.textContent.trim();
        nodes.push(p);
      }
    });
    // If nothing found, return empty string; else, array or single node
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  // For each slide, create a row: [image, text content]
  const rows = slides.map(slide => {
    // First column: image
    let img = null;
    const imgEl = slide.querySelector('.cmp-image img');
    if (imgEl) img = imgEl;

    // Second column: text content (if any)
    const textCell = extractTextContent(slide);
    return [img, textCell];
  });

  // Compose and replace
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
