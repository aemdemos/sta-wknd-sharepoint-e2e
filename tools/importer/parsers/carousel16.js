/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if carousel structure exists
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Header row as required
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  // Get all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide is a .cmp-carousel__item
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find image element (first cell)
    let imgCell = null;
    const imgWrapper = item.querySelector('.cmp-image');
    if (imgWrapper) {
      imgCell = imgWrapper.cloneNode(true);
    } else {
      const img = item.querySelector('img');
      if (img) imgCell = img.cloneNode(true);
    }

    // Find text content (second cell)
    let textCell = '';
    // We'll collect all non-image children
    const textFragments = [];
    Array.from(item.childNodes).forEach((child) => {
      // skip image wrappers
      if (
        child.nodeType === 1 &&
        (child.classList.contains('image') || child.classList.contains('cmp-image'))
      ) {
        return;
      }
      // skip empty text nodes
      if (child.nodeType === 3 && !child.textContent.trim()) {
        return;
      }
      textFragments.push(child.cloneNode(true));
    });
    if (textFragments.length > 0) {
      const frag = document.createDocumentFragment();
      textFragments.forEach((el) => frag.appendChild(el));
      textCell = frag;
    }
    // Always push two columns per row, even if second cell is empty
    rows.push([imgCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
