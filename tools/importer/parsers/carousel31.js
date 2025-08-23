/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: exactly as required
  const table = [['Carousel (carousel31)']];

  // Find the inner carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the carousel content area
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find each carousel slide
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  
  slides.forEach((slide) => {
    // IMAGE CELL: get the first image in the slide (if present)
    const img = slide.querySelector('img') || '';

    // TEXT CELL: get all non-image content for the slide
    // Strategy: get all elements that are not inside an image container and not images themselves, with non-empty text
    const textElements = [];
    const imageContainers = slide.querySelectorAll('.cmp-image, .image');
    const imageContainerSet = new Set(Array.from(imageContainers));
    // Gather all descendants of slide
    slide.querySelectorAll('*').forEach((el) => {
      // Ignore images and anything inside an image container
      if (el.tagName === 'IMG') return;
      let insideImageContainer = false;
      imageContainerSet.forEach((cont) => {
        if (cont.contains(el)) insideImageContainer = true;
      });
      if (insideImageContainer) return;
      // Only include elements with real text
      if (el.textContent && el.textContent.trim().length > 0) {
        if (!textElements.includes(el)) textElements.push(el);
      }
    });
    // If no text, use empty string
    const textCell = textElements.length ? textElements : '';
    
    // Push one row: [image, text]
    table.push([img, textCell]);
  });

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
