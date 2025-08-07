/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Header row, matching the example
  const rows = [['Carousel (carousel17)']];

  items.forEach((item) => {
    // First cell: the image element (first .cmp-image img in slide, or first img)
    let imgEl = null;
    const cmpImage = item.querySelector('.cmp-image');
    if (cmpImage) {
      imgEl = cmpImage.querySelector('img');
    } else {
      imgEl = item.querySelector('img');
    }

    // Second cell: gather any text content or additional markup not belonging to the image
    // We'll collect all elements NOT containing images, or meaningful text nodes
    const nonImageContent = [];
    Array.from(item.childNodes).forEach((child) => {
      // If it's the image container, skip
      if (child.nodeType === Node.ELEMENT_NODE && child.querySelector && child.querySelector('img')) return;
      // If empty text node, skip
      if (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) return;
      // For all other, include
      if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
        nonImageContent.push(child);
      }
    });

    // If no text content, use empty string
    rows.push([
      imgEl || '',
      nonImageContent.length ? nonImageContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
