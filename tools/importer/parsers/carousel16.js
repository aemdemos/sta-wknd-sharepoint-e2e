/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const cells = [['Carousel (carousel16)']];
  // Find the main carousel block
  const carousel = element.querySelector(':scope > div.cmp-carousel');
  if (!carousel) return;
  // Find the carousel slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  // For each slide
  const slideEls = content.querySelectorAll(':scope > .cmp-carousel__item');
  slideEls.forEach((slide) => {
    // 1. Image cell (first cell)
    let imgCell = '';
    const img = slide.querySelector('img');
    if (img) imgCell = img;

    // 2. Text/Content cell (second cell)
    // Collect all elements that could be visible text content (excluding the image container)
    let textNodes = [];
    // Include all non-.image child elements and non-empty text nodes
    slide.childNodes.forEach((node) => {
      if (node.nodeType === 1 && !node.classList.contains('image')) {
        textNodes.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Wrap stray text nodes in a <p> for semantics
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    // If no text found, check .image for captions or content after image
    if (textNodes.length === 0) {
      const imageContainer = slide.querySelector('.image');
      if (imageContainer) {
        imageContainer.childNodes.forEach((node) => {
          // Collect any non-img, non-empty text node
          if (node.nodeType === 1 && node.tagName !== 'IMG') {
            textNodes.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textNodes.push(p);
          }
        });
      }
    }
    // The cell is empty string if no text; otherwise, the array of elements
    const textCell = textNodes.length === 0 ? '' : textNodes;
    cells.push([imgCell, textCell]);
  });
  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
