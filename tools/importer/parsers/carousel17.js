/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  const rows = [['Carousel (carousel17)']]; // Header row

  items.forEach((item) => {
    // Get image (mandatory, first column)
    let imageCell = '';
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      const cmpImage = imageContainer.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      } else {
        const img = imageContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Get text content (second column, if any)
    // Strategy: Any block-level elements in the carousel item, except the image container, are assumed text content.
    const textNodes = Array.from(item.childNodes).filter((node) => {
      // Exclude the .image container
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) return false;
      // Exclude whitespace-only text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    // If still empty, try inside imageContainer (after image)
    if (!textCell && imageContainer) {
      const extraNodes = Array.from(imageContainer.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('cmp-image')) return false;
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
      if (extraNodes.length === 1) textCell = extraNodes[0];
      else if (extraNodes.length > 1) textCell = extraNodes;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
