/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column as in example
  const table = [['Carousel (carousel31)']];

  // Find the carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide
  const slides = Array.from(content.children).filter(
    (child) => child.classList.contains('cmp-carousel__item')
  );

  slides.forEach((slide) => {
    // First cell: image (if present)
    let imageCell = '';
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      const cmpImage = imageDiv.querySelector('.cmp-image');
      if (cmpImage) imageCell = cmpImage;
    }

    // Second cell: all non-image content
    let textCell = '';
    const textNodes = Array.from(slide.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    } // if none, remains ''

    // Each slide row must have two cells
    table.push([imageCell, textCell]);
  });

  // Create table and replace in DOM
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
