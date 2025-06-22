/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel component
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table with the correct header row: exactly one column
  const cells = [['Carousel (carousel36)']];

  items.forEach((item) => {
    // First cell: the <img> in the .image block
    let img = null;
    const imageBlock = item.querySelector(':scope > .image');
    if (imageBlock) {
      img = imageBlock.querySelector('img');
    }

    // Second cell: all content except the .image block, as an array of nodes/strings
    const textBlocks = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textBlocks.push(child);
      }
    });
    // Also collect stray text nodes (e.g. direct text children)
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textBlocks.push(span);
      }
    });
    let textCell;
    if (textBlocks.length > 0) {
      textCell = textBlocks;
    } else if (img && (img.getAttribute('alt') || img.getAttribute('title'))) {
      textCell = img.getAttribute('alt') || img.getAttribute('title');
    } else {
      textCell = '';
    }

    cells.push([img || '', textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
