/* global WebImporter */
export default function parse(element, { document }) {
  function extractSlides(carouselEl) {
    const slides = [];
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return slides;
    const items = content.querySelectorAll('.cmp-carousel__item');
    items.forEach((item) => {
      // Find the image
      let img = item.querySelector('img');
      if (!img) {
        const possibleImgs = item.querySelectorAll('img');
        if (possibleImgs.length > 0) img = possibleImgs[0];
      }
      // Find the text content: any element that is not the image or its container
      let textContent = '';
      const imageContainer = item.querySelector('.image, .cmp-image');
      const textNodes = [];
      Array.from(item.childNodes).forEach((node) => {
        if (imageContainer && imageContainer.contains(node)) return;
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node !== imageContainer) textNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textNodes.push(span);
        }
      });
      if (textNodes.length > 0) {
        const wrapper = document.createElement('div');
        textNodes.forEach((n) => wrapper.appendChild(n));
        textContent = wrapper;
      }
      slides.push({ img, textContent });
    });
    return slides;
  }

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = extractSlides(carousel);

  const rows = [];
  const headerRow = ['Carousel (carousel17)'];
  rows.push(headerRow);
  slides.forEach(({ img, textContent }) => {
    if (!img) return;
    // Always push two columns: image and text (empty if no text)
    rows.push([
      img,
      (textContent && (typeof textContent === 'string' ? textContent.trim() : textContent.textContent.trim())) ? textContent : ''
    ]);
  });

  // Ensure every slide row has exactly two columns (header stays single column)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
