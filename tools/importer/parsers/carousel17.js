/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const cells = [['Carousel (carousel17)']]; // Header row as required

  items.forEach((item) => {
    // Find the image for the first cell
    let imgEl = null;
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      const cmpImg = imageContainer.querySelector('[data-cmp-is="image"]');
      if (cmpImg) {
        imgEl = cmpImg.querySelector('img');
      }
    }

    // Gather all text content outside .image for the second cell
    const textContent = [];
    Array.from(item.childNodes).forEach((node) => {
      // Skip the image container
      if (node.nodeType === Node.ELEMENT_NODE && node === imageContainer) return;
      // Include element nodes that are not image container
      if (node.nodeType === Node.ELEMENT_NODE) {
        textContent.push(node);
      }
      // Include any text nodes (direct nonempty text)
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textContent.push(span);
      }
    });
    const textCell = textContent.length ? textContent : '';
    cells.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
