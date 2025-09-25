/* global WebImporter */
export default function parse(element, { document }) {
  function getCarouselSlides(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  function getImageElement(slide) {
    const img = slide.querySelector('img');
    return img || null;
  }

  function getTextContent(slide) {
    // Collect all text nodes that are not part of the image
    const textElements = [];
    Array.from(slide.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textElements.push(child.cloneNode(true));
      }
    });
    if (textElements.length === 0) return null;
    const textDiv = document.createElement('div');
    textElements.forEach((el) => textDiv.appendChild(el));
    return textDiv;
  }

  const carousels = Array.from(element.querySelectorAll(':scope > .carousel'));
  if (element.classList.contains('carousel')) {
    carousels.unshift(element);
  }

  const rows = [];
  const headerRow = ['Carousel (carousel8)'];
  rows.push(headerRow);

  carousels.forEach((carousel) => {
    const slides = getCarouselSlides(carousel);
    slides.forEach((slide) => {
      const img = getImageElement(slide);
      if (!img) return;
      const textContent = getTextContent(slide);
      if (textContent) {
        rows.push([img, textContent]);
      } else {
        rows.push([img]);
      }
    });
  });

  // Remove empty second column if there is no text content
  const normalizedRows = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 2 && (!rows[i][1] || (typeof rows[i][1] === 'string' && rows[i][1].trim() === ''))) {
      normalizedRows.push([rows[i][0]]);
    } else {
      normalizedRows.push(rows[i]);
    }
  }

  const block = WebImporter.DOMUtils.createTable(normalizedRows, document);
  element.replaceWith(block);
}
