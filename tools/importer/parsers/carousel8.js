/* global WebImporter */
export default function parse(element, { document }) {
  // Table always has one header row, one column with header text matching the example
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find carousel(s) inside element
  const carousels = element.querySelectorAll('.cmp-carousel');
  carousels.forEach((carousel) => {
    // Each .cmp-carousel__item is a slide
    const slides = carousel.querySelectorAll('.cmp-carousel__item');
    slides.forEach((slide) => {
      // Find the image element (the .cmp-image div or the img itself)
      let imageEl = slide.querySelector('.cmp-image');
      if (!imageEl) {
        // Sometimes just an <img>
        imageEl = slide.querySelector('img');
      }

      // To collect all text content except the image block
      // (in source, all text would be siblings of .image or direct children of slide except image)
      let imageWrapper = slide.querySelector('.image');
      let textContentEls = [];
      Array.from(slide.childNodes).forEach(node => {
        if (imageWrapper && node === imageWrapper) return;
        // skip whitespace
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        // skip nodes that are only the image
        // If node is element and contains the image, skip
        if (imageEl && node === imageEl) return;
        textContentEls.push(node);
      });

      // If there is text content, wrap it in a div for proper display (if multiple nodes)
      let contentCell = '';
      if (textContentEls.length === 1) {
        contentCell = textContentEls[0];
      } else if (textContentEls.length > 1) {
        const contentDiv = document.createElement('div');
        textContentEls.forEach(n => contentDiv.append(n));
        contentCell = contentDiv;
      }

      // Each slide row is one array with one cell (row), containing an array: [image, content]
      // If no text content, only the image is included
      if (imageEl && contentCell) {
        rows.push([[imageEl, contentCell]]);
      } else if (imageEl) {
        rows.push([[imageEl]]);
      } else if (contentCell) {
        rows.push([[contentCell]]);
      }
    });
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
