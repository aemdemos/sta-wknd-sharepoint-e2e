/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousels in the block (can be multiple)
  let carousels = Array.from(element.querySelectorAll('.cmp-carousel'));
  if (carousels.length === 0 && element.classList.contains('cmp-carousel')) {
    carousels = [element];
  }

  const headerRow = ['Carousel (carousel32)']; // header row must be single column
  const rows = [headerRow];

  carousels.forEach(carouselEl => {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return;
    const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
    slides.forEach(slideEl => {
      // First cell: image (mandatory)
      const imageDiv = slideEl.querySelector('.image');
      let imgEl = '';
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) imgEl = img.cloneNode(true);
      }
      // Second cell: text content (optional)
      let textContent = undefined;
      // Look for any text content inside the slide, not just direct children
      // Exclude .image div and navigation/actions
      const textNodes = Array.from(slideEl.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return !node.classList.contains('image');
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      if (textNodes.length > 0) {
        const wrapper = document.createElement('div');
        textNodes.forEach(node => {
          wrapper.appendChild(node.cloneNode(true));
        });
        textContent = wrapper;
      }
      // Only output 2 columns if there is text content, otherwise just 1 column
      if (textContent) {
        rows.push([imgEl, textContent]);
      } else {
        rows.push([imgEl]);
      }
    });
  });

  // Only replace if there are slides
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
