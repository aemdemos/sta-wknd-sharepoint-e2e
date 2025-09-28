/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all slides from the carousel
  function getSlides(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract the image element from a slide
  function getImage(slideEl) {
    const imgWrapper = slideEl.querySelector('.cmp-image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) return img;
    }
    const img = slideEl.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a slide (headings, paragraphs, links, etc.)
  function getTextContent(slideEl) {
    // Look for any text or block elements except image wrappers
    const textEls = [];
    slideEl.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!node.classList.contains('image') && !node.classList.contains('cmp-image')) {
          textEls.push(node.cloneNode(true));
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textEls.push(document.createTextNode(node.textContent.trim()));
      }
    });
    // Always return something for the second cell (empty string if no text)
    if (textEls.length === 0) return '';
    if (textEls.length === 1) return textEls[0];
    const wrapper = document.createElement('div');
    textEls.forEach((el) => wrapper.appendChild(el));
    return wrapper;
  }

  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) {
    carousel = element;
  }
  if (!carousel) return;

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  const slides = getSlides(carousel);
  slides.forEach((slide) => {
    const img = getImage(slide);
    if (img) {
      const textContent = getTextContent(slide);
      // Always push two cells per row (image, textContent or empty string)
      rows.push([img, textContent]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
