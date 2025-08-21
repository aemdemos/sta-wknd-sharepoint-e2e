/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [['Carousel (carousel16)']]; // header row

  // Find the carousel
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    // First cell: The image (mandatory)
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // Second cell: All non-image content (titles, description, CTAs, etc.)
    // We need to include ALL text, not just direct children, that is not part of the image.
    let textCell = '';
    const imageWrapper = slide.querySelector('.image');
    // Gather all elements that are not the image wrapper, as well as any text nodes not inside the image wrapper.
    const textNodes = [];
    slide.childNodes.forEach(node => {
      if (imageWrapper && imageWrapper.contains(node)) {
        // skip, handled as image
      } else if (node === imageWrapper) {
        // skip, handled as image
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        textNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textNodes.push(document.createTextNode(node.textContent));
      }
    });
    if (textNodes.length > 0) {
      // If just one element, use it directly. If several, wrap into a div.
      if (textNodes.length === 1) {
        textCell = textNodes[0];
      } else {
        const wrapper = document.createElement('div');
        textNodes.forEach(n => wrapper.appendChild(n));
        textCell = wrapper;
      }
    }
    cells.push([imageCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
