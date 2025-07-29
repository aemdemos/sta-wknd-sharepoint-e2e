/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel18)']);

  items.forEach((item) => {
    // IMAGE COLUMN (mandatory)
    let imgEl = null;
    const cmpImage = item.querySelector('.cmp-image img');
    if (cmpImage) imgEl = cmpImage;
    if (!imgEl) return;

    // TEXT COLUMN (optional)
    // Collect all non-image content (all direct children except .image)
    const textNodes = Array.from(item.children).filter(c => !c.classList.contains('image'));
    let textContent = '';
    if (textNodes.length > 0) {
      // If there's one direct text node, use it as reference; if multiple, use array
      textContent = textNodes.length === 1 ? textNodes[0] : textNodes;
    }
    rows.push([imgEl, textContent]);
  });

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
