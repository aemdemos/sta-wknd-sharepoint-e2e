/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is a carousel block
  if (!element || !element.classList.contains('carousel')) return;

  // Table header row
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides (items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Find image element (first cell)
    let imageCell = null;
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      // Find the actual image block
      const cmpImage = imageWrapper.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        imageCell = cmpImage.cloneNode(true);
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img.cloneNode(true);
      }
    }

    // Second cell: text content (title, description, CTA)
    let textCell = null;
    // Get all text content inside the slide but outside the image wrapper
    const textElements = Array.from(item.children).filter((el) => !el.classList.contains('image'));
    if (textElements.length > 0) {
      const textDiv = document.createElement('div');
      textElements.forEach((el) => textDiv.appendChild(el.cloneNode(true)));
      textCell = textDiv;
    }

    // Only push two columns if there is text content, otherwise just image
    if (imageCell && textCell) {
      rows.push([imageCell, textCell]);
    } else if (imageCell) {
      rows.push([imageCell]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
