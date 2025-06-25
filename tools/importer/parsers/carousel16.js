/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (single cell), matches block name from example exactly
  const headerRow = ['Carousel (carousel16)'];

  // Find the carousel wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get the carousel content and slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Build slide rows: [image, text content]
  const rows = items.map((item) => {
    // 1. IMAGE CELL: get the image element (prefer .cmp-image, fallback to img)
    let imageEl = item.querySelector('.cmp-image');
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // 2. TEXT CELL: keep all non-image content (headings, text, links, etc.)
    // Reference existing elements (do not clone)
    // Remove any .image/.cmp-image/img from the item, collect the rest
    const allContent = Array.from(item.children);
    let textEls = [];
    allContent.forEach(child => {
      // Only keep children that are not image wrappers
      if (!child.classList.contains('image') && !child.classList.contains('cmp-image') && child.tagName.toLowerCase() !== 'img') {
        textEls.push(child);
      }
    });
    // If there's no direct non-image content, check deeply
    if (textEls.length === 0) {
      // Deep search for non-image, non-empty text nodes, headings, etc.
      textEls = [];
      Array.from(item.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node;
          if (!el.classList.contains('image') && !el.classList.contains('cmp-image') && el.tagName.toLowerCase() !== 'img') {
            textEls.push(el);
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          textEls.push(document.createTextNode(node.textContent));
        }
      });
    }

    // If still empty, just set as empty string
    const textCell = (textEls.length > 0) ? textEls : '';
    return [imageEl, textCell];
  });

  // Create the block table
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  // Fix header colspan if needed
  const th = block.querySelector('th');
  if (th && block.rows[1] && block.rows[1].cells.length === 2) {
    th.setAttribute('colspan', '2');
  }

  // Replace the original element
  element.replaceWith(block);
}
