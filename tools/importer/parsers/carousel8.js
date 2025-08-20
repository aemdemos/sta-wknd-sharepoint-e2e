/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching example (1 column)
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find all slides/items
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  items.forEach((item) => {
    // --- Extract image (first cell) ---
    let imageCell = null;
    let cmpImage = item.querySelector('.cmp-image');
    if (cmpImage) {
      imageCell = cmpImage;
    } else {
      let img = item.querySelector('img');
      if (img) imageCell = img;
    }
    // --- Extract text content (second cell) ---
    // Gather all non-image children and their content
    let textParts = [];
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('image') && !child.classList.contains('cmp-image') && child.tagName.toLowerCase() !== 'img') {
        textParts.push(child);
      }
    });
    // Also include direct text nodes (not just elements)
    item.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        textParts.push(node.textContent.trim());
      }
    });
    // If nothing found, leave as empty string
    let textCell = textParts.length > 1 ? textParts : (textParts[0] || '');
    rows.push([imageCell || '', textCell]);
  });
  // Create and replace table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
