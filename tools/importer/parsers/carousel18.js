/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, even if the following rows have two columns.
  const rows = [['Carousel (carousel18)']];

  // Find carousel structure
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
    return;
  }
  
  // Collect slides
  const slides = [...content.querySelectorAll(':scope > .cmp-carousel__item')];
  slides.forEach((slide) => {
    // 1st cell: image
    let imageCell = '';
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) imageCell = img;
    } else {
      const img = slide.querySelector('img');
      if (img) imageCell = img;
    }

    // 2nd cell: all text content (not in .image)
    const textCellNodes = [];
    slide.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        // not the image container
        if (!child.classList.contains('image')) {
          textCellNodes.push(child);
        }
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        // wrap loose text
        const p = document.createElement('p');
        p.textContent = child.textContent.trim();
        textCellNodes.push(p);
      }
    });
    const textCell = textCellNodes.length ? textCellNodes : '';
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
