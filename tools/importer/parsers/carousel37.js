/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  const rows = [];
  // Header row: exactly one cell, per the markdown example
  rows.push(['Carousel (carousel37)']);

  slides.forEach((slide) => {
    // IMAGE: The image is always in the image wrapper
    let img = null;
    const imageWrapper = slide.querySelector('.image');
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
    }

    // TEXT: Gather all non-image content. 
    // Since the sample HTML has ONLY the image, no text, but the table allows for text
    // We'll take all direct children of the slide that are not the image wrapper
    const textContent = [];
    Array.from(slide.children).forEach((child) => {
      // Ignore the image wrapper
      if (child.classList.contains('image')) return;
      // Exclude controls or empty wrappers
      if (child.classList.contains('cmp-carousel__actions') || child.classList.contains('cmp-carousel__indicators')) return;
      // Otherwise, include all content
      textContent.push(child);
    });
    // Additionally, capture any direct text nodes (just in case)
    slide.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        textContent.push(document.createTextNode(node.textContent));
      }
    });

    // If there is no text content, set as empty string
    rows.push([
      img || '',
      textContent.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
