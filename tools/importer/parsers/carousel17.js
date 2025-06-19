/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure input is valid
  if (!element || typeof element.querySelector !== 'function') return;

  // Try to find the .cmp-carousel as a descendant, or else treat element as the carousel root
  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) carouselRoot = element;
  if (!carouselRoot || typeof carouselRoot.querySelector !== 'function') return;

  // Try to find the .cmp-carousel__content inside the root
  const content = carouselRoot.querySelector('.cmp-carousel__content');
  if (!content || typeof content.querySelectorAll !== 'function') return;

  // Find all slides in the carousel
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header must match the example exactly, and be a single column
  const rows = [['Carousel (carousel17)']];

  slides.forEach((slide) => {
    if (!slide || typeof slide.querySelector !== 'function') return;
    // Find the image element (img) and the cmp-image container if present
    let img = slide.querySelector('img');
    let imageCell = '';
    if (img) {
      let cmpImage = img.closest('.cmp-image');
      imageCell = cmpImage || img;
    }
    // Find the .image container for this slide, if it exists
    let imageContainer = img ? img.closest('.image') : null;
    // Collect all other child elements of the slide (except the imageContainer)
    const textNodes = [];
    Array.from(slide.children).forEach(child => {
      if (imageContainer && child === imageContainer) return;
      textNodes.push(child);
    });
    let cellContent = null;
    if (textNodes.length > 0) {
      // Combine image and text content in one cell
      if (imageCell) {
        cellContent = [imageCell, ...textNodes];
      } else {
        cellContent = textNodes;
      }
    } else {
      // Only image
      cellContent = imageCell;
    }
    // Only include the row if there is meaningful content
    if (cellContent) {
      rows.push([cellContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
