/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as specified
  const headerRow = ['Carousel (carousel39)'];

  // Find the .cmp-carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find the slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get each slide (item)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  const rows = items.map(item => {
    // First cell: image only
    let img = item.querySelector('img');
    let imageCell = img || '';

    // Second cell: all non-image content
    // 1. Find image wrapper if any.
    let imageWrapper = img ? img.closest('.image, .cmp-image') : null;
    // 2. Gather all direct children except image/image wrapper
    let contentElements = [];
    Array.from(item.children).forEach(child => {
      if (img && (child === imageWrapper || child.contains(img))) return;
      contentElements.push(child);
    });
    // 3. If empty, gather all descendants except image/image wrapper
    if (contentElements.length === 0) {
      Array.from(item.querySelectorAll('*')).forEach(el => {
        if (img && (el === img || (imageWrapper && imageWrapper.contains(el)))) return;
        if (!(el.classList.contains('cmp-image') || el.classList.contains('image'))) {
          contentElements.push(el);
        }
      });
    }
    // 4. Also include text nodes directly under the item, not in image wrapper
    Array.from(item.childNodes).forEach(n => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        // Only if not inside image wrapper
        if (!imageWrapper || !imageWrapper.contains(n)) {
          contentElements.push(document.createTextNode(n.textContent.trim()));
        }
      }
    });
    // 5. If still empty, use empty string
    let textCell = contentElements.length ? contentElements : '';

    return [imageCell, textCell];
  });

  // Compose full table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
