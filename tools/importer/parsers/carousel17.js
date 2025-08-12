/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Carousel (carousel17)'];

  // Locate carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  // For each slide, extract image and all text content (not in .image/.cmp-image)
  const rows = slides.map(slide => {
    // First column: image
    const img = slide.querySelector('.cmp-image img');

    // Second column: all non-image content
    // We'll gather all direct child elements and text nodes of the slide that are NOT part of .image or .cmp-image
    const textParts = [];
    Array.from(slide.childNodes).forEach(node => {
      // If element and not image container
      if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image') && !node.classList.contains('cmp-image')) {
        textParts.push(node);
      }
      // If text node and not empty
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        textParts.push(span);
      }
    });
    // If the image container (.image) contains further valid content (besides the .cmp-image itself), include it
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      Array.from(imageContainer.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('cmp-image')) {
          textParts.push(node);
        }
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textParts.push(span);
        }
      });
    }
    // If there's any text content, use it (as array), else use empty string
    return [img, textParts.length > 0 ? textParts : ''];
  });

  // Compose the table and replace the element
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
