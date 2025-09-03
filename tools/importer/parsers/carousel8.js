/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) {
    if (element.classList.contains('cmp-carousel')) {
      carousel = element;
    } else {
      carousel = element.querySelector('[class*=cmp-carousel]');
    }
  }
  if (!carousel) return;

  const items = carousel.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  items.forEach((item) => {
    let imageCell = null;
    const img = item.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      const imageDiv = item.querySelector('[data-cmp-is="image"]');
      if (imageDiv) {
        const img2 = imageDiv.querySelector('img');
        if (img2) imageCell = img2;
      }
    }
    if (!imageCell) return;

    // Extract text content for the second cell
    let textCell = null;
    const imageContainer = item.querySelector('.image');
    const textParts = [];
    if (imageContainer) {
      Array.from(item.children).forEach((child) => {
        if (child !== imageContainer) {
          if (child.matches('h1,h2,h3,h4,h5,h6,p,a')) {
            textParts.push(child.cloneNode(true));
          } else {
            child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach((el) => {
              textParts.push(el.cloneNode(true));
            });
          }
        }
      });
    }
    if (textParts.length) {
      const wrapper = document.createElement('div');
      textParts.forEach((el) => wrapper.appendChild(el));
      textCell = wrapper;
      rows.push([imageCell, textCell]);
    } else {
      rows.push([imageCell]); // Only one column if no text content
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
