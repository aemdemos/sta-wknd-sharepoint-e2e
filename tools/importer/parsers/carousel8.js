/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual carousel root (the .cmp-carousel inside the wrapper)
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;

  // Helper to get all slides from the carousel
  function getSlides(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper to extract image element from a slide
  function getImageElement(slide) {
    return slide.querySelector('img');
  }

  // Helper to extract text content from a slide (if present)
  function getTextContent(slide) {
    // Exclude .image container and its descendants
    const textNodes = [];
    Array.from(slide.childNodes).forEach(child => {
      if (child.nodeType === 1 && !child.classList.contains('image')) {
        textNodes.push(child);
      }
    });
    if (textNodes.length === 0) {
      Array.from(slide.childNodes).forEach(child => {
        if (child.nodeType === 3 && child.textContent.trim()) {
          textNodes.push(child.textContent.trim());
        }
      });
    }
    if (textNodes.length === 0) return '';
    if (textNodes.length === 1) return textNodes[0];
    return textNodes;
  }

  // Build the table rows
  const rows = [];
  // Header row as required (exactly one column)
  const headerRow = ['Carousel (carousel8)'];
  rows.push(headerRow);

  // Get all slides
  const slides = getSlides(carouselRoot);
  slides.forEach(slide => {
    const img = getImageElement(slide);
    if (!img) return;
    const textContent = getTextContent(slide);
    // Always push two columns, second cell empty if no text content
    rows.push([img, textContent ? textContent : '']);
  });

  // Ensure all slide rows have exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0,2);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
