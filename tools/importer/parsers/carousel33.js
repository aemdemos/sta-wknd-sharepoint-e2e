/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = content.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    let imageCell = '';
    const imageWrapper = slide.querySelector('.image');
    if (imageWrapper) {
      const cmpImage = imageWrapper.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Find all text content inside the slide except the image
    const textContent = [];
    slide.childNodes.forEach((node) => {
      if (
        node.nodeType === 1 && // element node
        !node.classList.contains('image') &&
        !node.classList.contains('cmp-carousel__actions') &&
        !node.classList.contains('cmp-carousel__indicators')
      ) {
        textContent.push(node);
      }
    });
    slide.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        textContent.push(document.createTextNode(node.textContent.trim()));
      }
    });

    // Always push two columns per row, second cell is empty string if no text
    rows.push([imageCell, textContent.length > 0 ? textContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
