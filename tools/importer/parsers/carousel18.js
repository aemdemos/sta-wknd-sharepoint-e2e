/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Defensive: find carousel content
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides (items)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // Find image element (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) return;
    const imageBlock = imgEl.closest('.cmp-image') || imgEl;

    // Try to find a text overlay or caption that is visually associated with this slide
    // Look for elements that are not part of the image structure
    let textContent = '';
    // 1. Look for a sibling after the image block (overlay/caption)
    let sibling = imageBlock.parentElement;
    while (sibling && sibling !== item) sibling = sibling.parentElement;
    if (sibling === item) {
      let found = false;
      for (let child of item.children) {
        if (found && child !== imageBlock) {
          textContent += child.outerHTML;
        }
        if (child === imageBlock) found = true;
      }
    }
    // 2. If not found, look for any text nodes or elements outside the image block
    if (!textContent) {
      Array.from(item.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && !node.contains(imgEl) && !node.matches('.image')) {
          textContent += node.outerHTML;
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textContent += node.textContent.trim();
        }
      });
    }
    // 3. If still empty, fallback to alt text
    if (!textContent) {
      textContent = imgEl.getAttribute('alt') || '';
    }

    rows.push([imageBlock, textContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
