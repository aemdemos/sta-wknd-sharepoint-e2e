/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image (mandatory)
    let imgEl = null;
    const imgContainer = item.querySelector('.cmp-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    if (!imgEl) return;

    // Find all text content in the slide (not just image captions)
    let textCell = '';
    // Clone the item to avoid mutating the original
    const itemClone = item.cloneNode(true);
    // Remove the image container from the clone
    const imgWrap = itemClone.querySelector('.image');
    if (imgWrap) imgWrap.remove();
    // Get all remaining text content (including headings, paragraphs, links, etc.)
    const textFragments = [];
    Array.from(itemClone.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.textContent.trim() || node.querySelector('a')) {
          textFragments.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textFragments.push(p);
      }
    });
    if (textFragments.length === 1) {
      textCell = textFragments[0];
    } else if (textFragments.length > 1) {
      textCell = textFragments;
    }
    // Always push two columns: image and text (even if text is empty)
    rows.push([imgEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
