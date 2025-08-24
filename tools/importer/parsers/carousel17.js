/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Carousel (carousel17)'];
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  const cmpContent = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!cmpContent) return;
  const items = cmpContent.querySelectorAll('.cmp-carousel__item');
  const rows = [headerRow];

  items.forEach((item) => {
    // Image: first <img> descendant in the slide
    const imgEl = item.querySelector('img');

    // Gather all non-image content for text cell
    let fragment = document.createDocumentFragment();
    // All direct children of .cmp-carousel__item except .image
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        fragment.appendChild(child);
      }
    });
    // Also check .image for overlays/captions etc, not just the image itself
    const imageDiv = item.querySelector('.image');
    if (imageDiv) {
      Array.from(imageDiv.children).forEach(e => {
        if (
          e.nodeType === Node.ELEMENT_NODE &&
          e.tagName.toLowerCase() !== 'img' &&
          !e.classList.contains('cmp-image') &&
          e.textContent.trim() !== ''
        ) {
          fragment.appendChild(e);
        }
      });
    }
    // Add any text nodes that are direct children and not only whitespace
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        fragment.appendChild(document.createTextNode(node.textContent));
      }
    });
    // If no content, use empty string for structure
    let textCell = fragment.childNodes.length > 0 ? fragment : '';
    rows.push([imgEl, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
