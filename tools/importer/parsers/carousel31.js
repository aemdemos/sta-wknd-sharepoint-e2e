/* global WebImporter */
export default function parse(element, { document }) {
  // Always create a single column header row as per markdown example
  const cells = [['Carousel (carousel31)']];

  // Find all carousels in this block
  const carouselBlocks = element.querySelectorAll('.cmp-carousel');
  carouselBlocks.forEach((carousel) => {
    const slides = carousel.querySelectorAll('.cmp-carousel__item');
    slides.forEach((slide) => {
      // --- LEFT CELL: Image ---
      let imageEl = null;
      const imageBlock = slide.querySelector('.image [data-cmp-is="image"]');
      if (imageBlock) {
        imageEl = imageBlock.querySelector('img');
      }
      if (!imageEl) {
        imageEl = slide.querySelector('img');
      }
      
      // --- RIGHT CELL: Text Content ---
      // Collect all content that is not the image block
      let textEls = [];
      // Get all children except .image
      Array.from(slide.children).forEach(child => {
        if (!child.classList.contains('image')) {
          // If not an empty div
          if (child.textContent.trim().length > 0 || child.children.length > 0) {
            textEls.push(child);
          }
        }
      });
      // Fallback to textContent if nothing else
      if (textEls.length === 0) {
        const text = Array.from(slide.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0)
          .map(n => {
            const p = document.createElement('p');
            p.textContent = n.textContent.trim();
            return p;
          });
        textEls = textEls.concat(text);
      }
      // If still empty, use empty string
      const textCell = textEls.length === 1 ? textEls[0] : (textEls.length > 1 ? textEls : '');

      // Ensure TWO columns per row: [image, text content]
      cells.push([imageEl, textCell]);
    });
  });
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
