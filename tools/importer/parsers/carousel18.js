/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // The block table: header row must be TWO columns as in the example
  const rows = [['Carousel (carousel18)', '']];

  items.forEach(item => {
    // First cell: image (the <img> inside .cmp-image)
    let imageCell = '';
    const img = item.querySelector('img');
    if (img) imageCell = img;
    // Second cell: all non-image content as children (preserve existing structure, if any)
    const imageContainer = item.querySelector('.image');
    const textNodes = [];
    Array.from(item.childNodes).forEach(child => {
      if (imageContainer && child === imageContainer) return;
      if (child.nodeType === 1 && child.textContent.trim().length > 0) {
        textNodes.push(child);
      } else if (child.nodeType === 3 && child.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.textContent = child.textContent.trim();
        textNodes.push(span);
      }
    });
    let textCell = '';
    if (textNodes.length === 1) textCell = textNodes[0];
    else if (textNodes.length > 1) textCell = textNodes;
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
