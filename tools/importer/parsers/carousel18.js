/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Get all slides
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));
  if (slides.length === 0) return;
  
  // Compose table rows
  const rows = [['Carousel (carousel18)']];
  slides.forEach((slide) => {
    // IMAGE CELL (first column)
    let img = slide.querySelector('img');
    let imgCell = img || '';

    // TEXT CELL (second column)
    // Gather ALL elements inside the slide that are NOT part of the image container
    let imageContainer = slide.querySelector('.image');
    let textCellContent = [];
    Array.from(slide.children).forEach((child) => {
      if (!imageContainer || (child !== imageContainer && !imageContainer.contains(child))) {
        if (child.querySelector('img')) return; // skip any additional images
        textCellContent.push(child);
      }
    });
    // Also check for direct text nodes (outside containers)
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textCellContent.push(p);
      }
    });
    let textCell = '';
    if (textCellContent.length === 1) {
      textCell = textCellContent[0];
    } else if (textCellContent.length > 1) {
      textCell = textCellContent;
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
