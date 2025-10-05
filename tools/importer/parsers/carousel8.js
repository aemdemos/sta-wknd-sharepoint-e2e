/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel element
  const carouselEl = element.querySelector('.cmp-carousel');
  if (!carouselEl) return;

  // Find all slides
  const slides = Array.from(carouselEl.querySelectorAll('.cmp-carousel__item'));
  if (slides.length === 0) return;

  // Build table rows
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find the image element (reference the actual <img> element)
    const img = slide.querySelector('img');
    if (!img) return;

    // Try to extract all text content from the slide (headings, paragraphs, links, etc.)
    let textCell = '';
    let textContainer = null;
    const imageParent = img.closest('.image, [data-cmp-is="image"]');
    if (imageParent && imageParent.parentElement) {
      let sibling = imageParent.nextElementSibling;
      while (sibling) {
        if (!sibling.classList.contains('cmp-carousel__actions') && !sibling.classList.contains('cmp-carousel__indicators')) {
          textContainer = sibling;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
    }
    if (!textContainer) {
      const possibleTextNodes = Array.from(slide.children).filter(child =>
        !child.classList.contains('image') &&
        !child.classList.contains('cmp-carousel__actions') &&
        !child.classList.contains('cmp-carousel__indicators')
      );
      if (possibleTextNodes.length > 0) {
        textContainer = possibleTextNodes[0];
      }
    }
    if (textContainer) {
      textCell = textContainer.cloneNode(true);
      rows.push([img, textCell]);
    } else {
      rows.push([img]); // Only image column, do not add empty column
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
