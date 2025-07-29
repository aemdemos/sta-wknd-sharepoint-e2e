/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find direct child by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  // Find the cmp-carousel element inside this block
  const carousel = findChildByClass(element, 'cmp-carousel');
  if (!carousel) return;
  const content = findChildByClass(carousel, 'cmp-carousel__content');
  if (!content) return;

  // Find all slide elements
  const slideEls = Array.from(content.children).filter(
    (el) => el.classList && el.classList.contains('cmp-carousel__item')
  );
  if (slideEls.length === 0) return;

  // Table header
  const rows = [['Carousel (carousel16)']];

  slideEls.forEach((slide) => {
    // Find the image (first cell)
    const img = slide.querySelector('img');
    let imageCell = img || '';

    // For text content: gather ALL content except the image
    // We'll collect all elements that are not the image wrapper, controls, or indicators
    const textCellFragments = [];
    Array.from(slide.children).forEach(child => {
      // If this is image container, skip
      if (child.classList.contains('image')) return;
      // Skip controls/indicators
      if (child.classList.contains('cmp-carousel__actions') || child.classList.contains('cmp-carousel__indicators')) return;
      if (child.textContent && child.textContent.trim().length > 0) {
        textCellFragments.push(child);
      }
    });
    // If direct children didn't yield any text content, look deeper for any text or elements
    if (textCellFragments.length === 0) {
      // Get all elements/text except those within '.image', '.cmp-carousel__actions', '.cmp-carousel__indicators'
      const forbidden = ['image', 'cmp-carousel__actions', 'cmp-carousel__indicators'];
      Array.from(slide.querySelectorAll('*')).forEach(node => {
        if (forbidden.some(cls => node.classList.contains(cls))) return;
        // Only add non-empty, non-image elements
        if (node.tagName !== 'IMG' && node.textContent && node.textContent.trim().length > 0) {
          textCellFragments.push(node);
        }
      });
    }
    // If still nothing, try direct text nodes not inside image
    if (textCellFragments.length === 0) {
      Array.from(slide.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          textCellFragments.push(document.createTextNode(node.textContent));
        }
      });
    }
    // Only include the second cell if there's actually content
    rows.push([imageCell, textCellFragments.length > 0 ? textCellFragments : '']);
  });

  // Create and insert the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
