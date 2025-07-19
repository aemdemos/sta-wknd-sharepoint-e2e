/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (block name as single column)
  const headerRow = ['Carousel (carousel8)'];
  const cells = [headerRow];

  // Find the carousel inside the provided element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides/items
  const slides = carousel.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    // First column: image
    let imageEl = null;
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }

    // Second column: all content in slide except for the image container
    let textElements = [];
    // Get all direct children of the slide that are not the imageContainer
    Array.from(slide.children).forEach((child) => {
      if (child !== imageContainer) {
        // If it's not the image container, add it (whole element)
        textElements.push(child);
      }
    });
    // If there are no extra elements, use empty string
    let textContent = '';
    if (textElements.length === 1) textContent = textElements[0];
    else if (textElements.length > 1) textContent = textElements;

    cells.push([imageEl, textContent]);
  });

  // Build the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
