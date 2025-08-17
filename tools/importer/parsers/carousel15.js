/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example exactly
  const headerRow = ['Carousel (carousel15)'];
  const rows = [];

  // 2. Locate the carousel items
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  items.forEach((item) => {
    // 3. Extract image (first column)
    let imageCell = '';
    // Use the FIRST <img> from item
    const img = item.querySelector('img');
    if (img) imageCell = img;

    // 4. Extract all text content except the image (second column)
    let textCell = '';
    // Direct child nodes, excluding .image div and <img>
    const textContentNodes = [];
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === 1 && (node.classList.contains('image') || node.tagName === 'IMG')) {
        // skip image wrappers
        return;
      }
      if (node.nodeType === 1) {
        // element node, include if not image wrapper
        if (node.textContent.trim().length > 0) textContentNodes.push(node);
      } else if (node.nodeType === 3) {
        // text node, non-empty
        if (node.textContent.trim().length > 0) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textContentNodes.push(span);
        }
      }
    });
    // If there's no text content, fallback to image alt or title
    if (textContentNodes.length === 0 && img) {
      const alt = img.getAttribute('alt');
      if (alt) {
        const altSpan = document.createElement('span');
        altSpan.textContent = alt;
        textContentNodes.push(altSpan);
      } else {
        const title = img.getAttribute('title');
        if (title) {
          const titleSpan = document.createElement('span');
          titleSpan.textContent = title;
          textContentNodes.push(titleSpan);
        }
      }
    }

    if (textContentNodes.length === 1) {
      textCell = textContentNodes[0];
    } else if (textContentNodes.length > 1) {
      textCell = textContentNodes;
    } else {
      textCell = '';
    }
    rows.push([imageCell, textCell]);
  });

  // 5. Compose and inject block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
