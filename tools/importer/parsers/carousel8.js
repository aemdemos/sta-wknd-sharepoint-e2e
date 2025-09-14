/* global WebImporter */
export default function parse(element, { document }) {
  if (!element.classList.contains('carousel')) return;

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    let imgEl = null;
    const imageContainer = item.querySelector('.cmp-image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    if (!imgEl) return;

    // Find text content (optional)
    const textNodes = [];
    item.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image')) {
        textNodes.push(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textNodes.push(document.createTextNode(node.textContent));
      }
    });

    // Always push two columns per row, even if second is empty
    rows.push([imgEl, textNodes.length ? textNodes : '']);
  });

  // Ensure all rows (except header) have exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
