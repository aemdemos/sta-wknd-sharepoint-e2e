/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly as in the example
  const headerRow = ['Carousel (carousel38)'];
  const rows = [headerRow];

  // Find the carousel root element
  const carousel = element.querySelector('.cmp-carousel') || element;
  // Extract all slides (items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  slides.forEach((slide) => {
    // First cell: image only
    let imgCell = '';
    const img = slide.querySelector('img');
    if (img) imgCell = img;

    // Second cell: extract all content except image wrapper
    const textCellContent = [];
    // Consider both direct child nodes and their descendants, but exclude anything inside .image
    // Get all .image elements to exclude their content
    const imageEls = Array.from(slide.querySelectorAll('.image'));
    // For each child node of slide
    Array.from(slide.childNodes).forEach((node) => {
      // Exclude image wrapper and its descendants
      if (node.nodeType === 1 && !node.classList.contains('image')) {
        // Skip empty nodes
        if (node.textContent && node.textContent.trim().length > 0) {
          textCellContent.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim().length > 0) {
        // text node, not just whitespace
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textCellContent.push(p);
      }
    });
    // In case there is relevant content nested deeper (not direct children), search under slide but not inside .image
    if (textCellContent.length === 0) {
      const nonImageEls = Array.from(slide.querySelectorAll(':scope *')).filter((el) => !el.closest('.image'));
      nonImageEls.forEach((el) => {
        if (el.textContent && el.textContent.trim().length > 0) {
          // Only push unique elements
          if (!textCellContent.includes(el)) {
            textCellContent.push(el);
          }
        }
      });
    }
    let textCell = '';
    if (textCellContent.length > 0) {
      textCell = textCellContent;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
