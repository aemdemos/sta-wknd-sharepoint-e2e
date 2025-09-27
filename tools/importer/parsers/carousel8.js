/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct carousels in the block
  const carousels = Array.from(element.querySelectorAll(':scope > .cmp-carousel'));
  if (carousels.length === 0) {
    carousels.push(...element.querySelectorAll('.cmp-carousel'));
  }

  // Table header row
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  carousels.forEach((carousel) => {
    const slideEls = carousel.querySelectorAll('.cmp-carousel__item');
    slideEls.forEach((slide) => {
      let img = slide.querySelector('.cmp-image__image');
      if (!img) img = slide.querySelector('img');
      if (!img) return;
      // Try to find text content in the slide
      let textContent = '';
      // Accept any element that is not the image, and any non-empty text node
      const textNodes = Array.from(slide.childNodes)
        .filter((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.querySelector('img')) return false;
            if (node.classList.contains('image')) return false;
            if (node.classList.contains('cmp-image')) return false;
            return true;
          }
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
          }
          return false;
        });
      if (textNodes.length > 0) {
        const div = document.createElement('div');
        textNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            div.appendChild(node.cloneNode(true));
          } else if (node.nodeType === Node.TEXT_NODE) {
            div.appendChild(document.createTextNode(node.textContent));
          }
        });
        textContent = div;
      }
      // Always add two cells: image and text (empty string if no text content)
      rows.push([img, textContent || '']);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
