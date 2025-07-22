/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find all carousel slide items
  const slideEls = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const rows = [];
  // Header row: must match the example, and be a single column
  rows.push(['Carousel (carousel37)']);
  // For each slide, extract image (always first cell) and text content (always second cell, even if empty)
  slideEls.forEach((slide) => {
    // IMAGE cell
    let imgCell = '';
    const imgEl = slide.querySelector('.image .cmp-image') || slide.querySelector('.image img');
    if (imgEl) imgCell = imgEl;
    // TEXT cell: all direct children after the .image div
    // by default, it should be an empty string if nothing is present
    let textCell = '';
    const children = Array.from(slide.children);
    let foundImageDiv = false;
    const textNodes = [];
    for (const child of children) {
      if (!foundImageDiv && child.classList.contains('image')) {
        foundImageDiv = true;
        continue;
      }
      if (foundImageDiv) {
        if ((child.nodeType === 1 && child.textContent.trim() !== '') || (child.nodeType === 3 && child.textContent.trim() !== '')) {
          textNodes.push(child);
        }
      }
    }
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    // Always push a two-column row
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
