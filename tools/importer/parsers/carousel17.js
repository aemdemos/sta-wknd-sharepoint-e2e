/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel element inside the wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find the carousel content node holding the slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  // Each slide is a direct child div with class cmp-carousel__item
  const slideDivs = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header as in the example
  const rows = [['Carousel (carousel17)']];

  slideDivs.forEach((slide) => {
    // First cell: image. Always present and required.
    let imgEl = null;
    const imageWrapper = slide.querySelector('.image');
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    if (!imgEl) {
      imgEl = slide.querySelector('img');
    }
    if (!imgEl) return; // skip if no image found

    // Second cell: all non-image content, maintaining semantic HTML
    // Remove image wrappers from a clone, but reference content from the real DOM
    const nonImageNodes = [];
    // Collect direct children of the slide that are NOT the image wrapper
    Array.from(slide.children).forEach(child => {
      // Skip image wrappers/divs containing images
      if (child.classList.contains('image') || child.querySelector('img')) return;
      // If not image, include if not empty
      if (child.textContent.trim()) {
        nonImageNodes.push(child);
      }
    });
    // If no non-image blocks, treat as empty string
    let textCell = '';
    if (nonImageNodes.length === 1) textCell = nonImageNodes[0];
    else if (nonImageNodes.length > 1) textCell = nonImageNodes;
    rows.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
