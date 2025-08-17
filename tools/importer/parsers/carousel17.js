/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Carousel (carousel17)'];

  // Find carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide elements
  const slideEls = Array.from(content.children).filter(child => child.classList && child.classList.contains('cmp-carousel__item'));

  const rows = slideEls.map(slide => {
    // IMAGE CELL: Use cmp-image if present, else first img
    let imgCell = '';
    const cmpImage = slide.querySelector('.cmp-image');
    if (cmpImage) {
      imgCell = cmpImage;
    } else {
      const img = slide.querySelector('img');
      if (img) imgCell = img;
    }

    // TEXT CELL: Find overlay text (common for carousels) or any text content not in image
    let textCell = '';
    const textParts = [];
    // Common overlay pattern: look for elements with class containing 'overlay', 'caption', or 'text' within slide
    const overlay = slide.querySelector('[class*="overlay"], [class*="caption"], [class*="text"]');
    if (overlay && overlay.textContent.trim()) {
      textParts.push(overlay);
    } else {
      // If no overlay/caption, collect all elements in slide except .image/.cmp-image
      Array.from(slide.children).forEach(child => {
        if (
          !child.classList.contains('image') &&
          !child.classList.contains('cmp-image') &&
          child.textContent.trim()
        ) {
          textParts.push(child);
        }
      });
    }
    // If still nothing, look for stray text nodes
    if (textParts.length === 0) {
      Array.from(slide.childNodes).forEach(n => {
        if (n.nodeType === 3 && n.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = n.textContent.trim();
          textParts.push(span);
        }
      });
    }
    if (textParts.length > 0) {
      textCell = textParts;
    }

    return [imgCell, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
