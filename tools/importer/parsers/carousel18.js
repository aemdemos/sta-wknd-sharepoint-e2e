/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all slides from the carousel
  function getSlides(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract the image element from a slide
  function getImageCell(slide) {
    const img = slide.querySelector('img');
    if (img) return img;
    const cmpImage = slide.querySelector('.cmp-image');
    if (cmpImage) return cmpImage;
    return '';
  }

  // Helper to extract text content from a slide (if any)
  function getTextCell(slide) {
    let textParts = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textParts.push(child.cloneNode(true));
      }
    });
    if (textParts.length === 0) return '';
    if (textParts.length === 1) return textParts[0];
    const wrapper = document.createElement('div');
    textParts.forEach(part => wrapper.appendChild(part));
    return wrapper;
  }

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  const slides = getSlides(carousel);
  slides.forEach((slide) => {
    const imageCell = getImageCell(slide);
    const textCell = getTextCell(slide);
    // Always push two columns per row (image, text), even if text is empty string
    rows.push([imageCell, textCell !== undefined ? textCell : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
