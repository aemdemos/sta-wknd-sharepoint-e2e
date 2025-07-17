/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const cells = [['Carousel (carousel14)']];

  // Find carousel and its slides
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    // Image: first cell
    const img = slide.querySelector('img');

    // Second cell: all non-image content in the slide (headings, text, CTAs, etc.)
    // We'll collect all child nodes that are not the image wrapper
    let textEls = [];
    Array.from(slide.children).forEach((child) => {
      // Exclude the image wrapper (class 'image' or contains an img)
      if (!child.classList.contains('image') && !child.querySelector('img')) {
        // Only push if not empty
        if (child.textContent.trim()) textEls.push(child);
      }
    });
    // If nothing above, fallback: look for text nodes directly under .cmp-carousel__item
    if (textEls.length === 0) {
      Array.from(slide.childNodes).forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim()) { // Text node
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textEls.push(span);
        }
      });
    }
    // Compose cell: either text content array or empty string
    const textCell = textEls.length > 0 ? textEls : '';
    cells.push([img, textCell]);
  });

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
