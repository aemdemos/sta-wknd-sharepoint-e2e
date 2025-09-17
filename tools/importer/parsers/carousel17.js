/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    let imageEl = null;
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    if (!imageEl) return;

    // Always create two columns: image and (possibly empty) text cell
    let textCell = '';
    const nonImageChildren = Array.from(slide.children).filter(child => !child.classList.contains('image'));
    if (nonImageChildren.length > 0) {
      const frag = document.createElement('div');
      nonImageChildren.forEach(child => frag.appendChild(child.cloneNode(true)));
      if (frag.textContent.trim().length > 0) {
        textCell = frag.childNodes.length === 1 ? frag.firstChild : frag;
      }
    }
    rows.push([imageEl, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
