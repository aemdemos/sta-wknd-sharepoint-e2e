/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Prepare block table header
  const cells = [['Carousel (carousel8)']];

  // Each slide becomes a row
  const slides = content.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // 1st col: Image (mandatory)
    let imageEl = null;
    const imgBlock = slide.querySelector('.image');
    if (imgBlock) {
      imageEl = imgBlock.querySelector('img');
    }

    // 2nd col: Gather all possible text content not part of the image
    const textEls = [];
    // All direct children except the image container
    Array.from(slide.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textEls.push(child);
      }
    });
    // Also fetch any text nodes directly under slide (not inside image)
    Array.from(slide.childNodes).forEach((node) => {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent && node.textContent.trim().length > 0
      ) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textEls.push(span);
      }
    });
    // If there's no text content, use empty string
    const textCell = textEls.length > 0 ? textEls : '';
    cells.push([imageEl, textCell]);
  });

  // Build table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
