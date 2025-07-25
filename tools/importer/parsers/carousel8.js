/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per specified block name
  const headerRow = ['Carousel (carousel8)'];

  // Locate carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides (carousel items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  const rows = items.map((item) => {
    // IMAGE CELL: first <img> anywhere in the slide
    let imageCell = '';
    const img = item.querySelector('img');
    if (img) imageCell = img;

    // TEXT CELL: gather all content that is not part of the image or image container
    // Approach: All children of 'item' that are not the image wrapper or do not contain an <img> directly
    const textEls = [];
    Array.from(item.children).forEach(child => {
      // Exclude direct containers of an <img>
      const isImageOrImageWrapper = child.querySelector('img') || child.classList.contains('image') || child.hasAttribute('data-cmp-is');
      if (!isImageOrImageWrapper) {
        textEls.push(child);
      }
    });
    // Also, include any non-empty text nodes directly under the item
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textEls.push(node.textContent.trim());
      }
    });
    let textCell = '';
    if (textEls.length === 1) textCell = textEls[0];
    else if (textEls.length > 1) textCell = textEls;
    // If no textEls, textCell remains ''
    return [imageCell, textCell];
  });
  
  // Compose cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
