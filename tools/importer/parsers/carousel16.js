/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find carousel slides
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Header row: only one cell
  const rows = [['Carousel (carousel16)']];

  // For each slide
  items.forEach(item => {
    // --- First cell: image ---
    let imgEl = null;
    const imageWrap = item.querySelector('.image');
    if (imageWrap) imgEl = imageWrap.querySelector('img');
    if (!imgEl) imgEl = item.querySelector('img');
    if (!imgEl) return;

    // --- Second cell: all text content except image ---
    // Get all non-image elements as potential text content (headings, paragraphs, etc.)
    const textFragments = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textFragments.push(child);
      }
    });
    // Also include text nodes that are not inside the image container
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Don't include if it's only whitespace
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textFragments.push(span);
      }
    });
    // If there is no text content, make cell blank string, else fragments
    const textCell = textFragments.length > 0 ? textFragments : '';
    rows.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
