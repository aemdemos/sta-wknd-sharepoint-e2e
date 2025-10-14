/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel8) block parsing
  // Table: header row, then one row per slide

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    element.remove();
    return;
  }

  // Find all slides (carousel items)
  const slideEls = carouselContent.querySelectorAll('.cmp-carousel__item');

  slideEls.forEach((slide) => {
    // Find image element inside slide
    let imageCell = '';
    const img = slide.querySelector('.cmp-image__image');
    if (img) {
      imageCell = img;
    } else {
      const fallbackImg = slide.querySelector('img');
      if (fallbackImg) {
        imageCell = fallbackImg;
      }
    }

    // Collect all possible text content from the slide
    // Use less specific selectors to ensure all text is captured
    const textContentElements = Array.from(slide.querySelectorAll(':scope > *:not(.image):not(.cmp-image)'));
    // Filter only elements that contain visible text (not empty)
    const textParts = textContentElements.filter(el => el.textContent && el.textContent.trim().length > 0);

    // If there is any text content, add as second cell, else only image
    if (textParts.length) {
      rows.push([imageCell, textParts]);
    } else {
      rows.push([imageCell]);
    }
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
