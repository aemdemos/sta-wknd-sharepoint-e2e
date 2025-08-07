/* global WebImporter */
export default function parse(element, { document }) {
  // --- Header row: single cell, must match the example ---
  const rows = [['Carousel (carousel15)']];

  // Find the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // For each slide, extract image and text content
  items.forEach((item) => {
    // IMAGE CELL
    let imageCell = '';
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      // Prefer any <img> in the imageWrapper
      const img = imageWrapper.querySelector('img');
      if (img) imageCell = img;
    }

    // TEXT CELL
    // Collect all direct children of cmp-carousel__item except .image
    let textCell = '';
    const textElements = Array.from(item.children).filter(child => !child.classList.contains('image'));
    // Only set textCell if we actually have non-image content
    if (textElements.length === 1) {
      textCell = textElements[0];
    } else if (textElements.length > 1) {
      textCell = textElements;
    }
    // If there is no text content, textCell remains ''

    // Every row should be exactly two cells: image, then text
    rows.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
