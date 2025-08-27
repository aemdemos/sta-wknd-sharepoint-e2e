/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row exactly as in the example
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find the carousel root (support both wrapper and direct cmp-carousel)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) {
    carousel = element;
  }
  if (!carousel) return;

  // Get carousel content container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // Find the first img inside the item (mandatory for first cell)
    const imgEl = item.querySelector('img');
    if (!imgEl) return; // skip if no image
    
    // For the text cell, collect all non-image, non-control, non-indicator visible content
    // We'll gather direct children that are not image wrappers
    const imageWrapper = item.querySelector('.image, .cmp-image');
    const textContentEls = [];
    // Only direct children not containing images
    Array.from(item.children).forEach((child) => {
      if (imageWrapper && (child === imageWrapper || imageWrapper.contains(child))) return;
      // Exclude known carousel navigation or indicator wrappers
      if (child.classList.contains('cmp-carousel__actions') || child.classList.contains('cmp-carousel__indicators')) return;
      // Only keep if contentful
      if (child.textContent && child.textContent.trim().length > 0) {
        textContentEls.push(child);
      }
    });
    // If still empty, check for contentful nodes nested deeper, but outside of image and controls
    if (textContentEls.length === 0) {
      Array.from(item.childNodes).forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim().length > 0) {
          textContentEls.push(node);
        }
      });
    }
    // Second cell: If any text content, use as array, else ''
    const secondCell = textContentEls.length > 0 ? textContentEls : '';
    rows.push([imgEl, secondCell]);
  });

  // Create and replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
