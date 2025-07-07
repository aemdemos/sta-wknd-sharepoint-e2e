/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one column/cell ONLY
  const headerRow = ['Carousel (carousel35)'];
  const dataRows = [];

  // Find the carousel container
  const carousel = element.querySelector(':scope > div.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide = .cmp-carousel__item
  const slides = content.querySelectorAll(':scope > .cmp-carousel__item');
  slides.forEach((slide) => {
    // Image cell: get first <img> in slide
    const img = slide.querySelector('img');
    const imgCell = img || '';

    // Text cell: collect all nodes NOT inside .image
    const imageContainer = slide.querySelector('.image');
    const textParts = [];
    slide.childNodes.forEach((node) => {
      if (imageContainer && imageContainer.contains(node)) return;
      if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image')) {
        textParts.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textParts.push(p);
      }
    });
    const textCell = textParts.length ? textParts : '';
    dataRows.push([imgCell, textCell]);
  });

  // Compose table: header is single column, data rows are two columns
  // So: cells = [[headerRow[0]], [img, text], [img, text], ...]
  const cells = [headerRow, ...dataRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
