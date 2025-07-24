/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const cells = [['Carousel (carousel37)']];

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = content.querySelectorAll(':scope > .cmp-carousel__item');

  slides.forEach((slide) => {
    // 1. IMAGE CELL: Find the first <img> in the .image wrapper
    let imgCell = '';
    const imageWrapper = slide.querySelector(':scope > .image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) imgCell = img;
    }

    // 2. TEXT CELL: Gather ALL content not inside the .image wrapper
    const textCellContent = [];
    // Add all non-image children (preserving order)
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textCellContent.push(child);
      }
    });
    // Capture direct text nodes (not inside .image) as text content
    Array.from(slide.childNodes).forEach(node => {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent && node.textContent.trim() &&
        (!node.parentElement || (node.parentElement === slide))
      ) {
        textCellContent.push(document.createTextNode(node.textContent));
      }
    });
    // If nothing is found, set to '' (empty cell)
    const textCell = textCellContent.length ? textCellContent : '';
    // Add the row
    cells.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
