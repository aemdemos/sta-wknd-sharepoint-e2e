/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  // Get all carousel items (slides)
  const items = content.querySelectorAll('.cmp-carousel__item');

  const rows = [];
  // Header row: block name only, exactly one column
  rows.push(['Carousel (carousel38)']);

  // For each slide, create a row: [image, text]
  items.forEach((item) => {
    // IMAGE CELL: first <img> found in the item (or empty string if none)
    let imageCell = '';
    const img = item.querySelector('img');
    if (img) imageCell = img;

    // TEXT CELL: all direct children except for image containers and navigation/actions
    // We'll gather any heading, paragraph, or other text content, even if deeply nested, except for the image itself
    let textElements = [];
    // Get all elements that are NOT the image or an ancestor of the image
    // We'll exclude the node or any ancestor of the image
    let imageAncestors = new Set();
    if (img) {
      let p = img.parentNode;
      while (p && p !== item) {
        imageAncestors.add(p);
        p = p.parentNode;
      }
      // also add the image itself
      imageAncestors.add(img);
    }
    // For robust extraction: get all element descendants that are not inside imageAncestors
    function collectText(node) {
      if (imageAncestors.has(node)) return;
      if (node.nodeType === 3 && node.textContent.trim()) {
        // non-empty text node
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textElements.push(span);
      } else if (node.nodeType === 1) {
        // Only include navigational controls if they contain visible text and are not part of known nav/actions
        if (!node.classList.contains('cmp-carousel__actions') && !node.classList.contains('cmp-carousel__indicators')) {
          // If element contains text and is not an image container
          if (node.children.length === 0 && node.textContent.trim()) {
            textElements.push(node);
          } else {
            // Recursively collect from children
            Array.from(node.childNodes).forEach(collectText);
          }
        }
      }
    }
    Array.from(item.childNodes).forEach(collectText);
    let textCell = textElements.length ? textElements : '';
    rows.push([imageCell, textCell]);
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
