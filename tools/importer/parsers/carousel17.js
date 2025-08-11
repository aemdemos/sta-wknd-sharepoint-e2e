/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell, matching the example
  const headerRow = ['Carousel (carousel17)'];

  // Find the carousel root
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;
  // Find all slide items
  const content = carousel.querySelector('.cmp-carousel__content');
  const items = content ? Array.from(content.children).filter(e => e.classList.contains('cmp-carousel__item')) : [];

  // Build output rows: first row is header (single cell), subsequent rows are slides (2 cells)
  const rows = [headerRow];

  items.forEach(item => {
    // Get image element for first cell
    const image = item.querySelector('img');
    // Gather all non-image content for the second cell
    let textCellContent = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textCellContent.push(child);
      }
    });
    // Also check for any direct text nodes
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textCellContent.push(span);
      }
    });
    const textCell = textCellContent.length > 0 ? textCellContent : '';
    rows.push([image, textCell]); // Each slide is a row with 2 columns
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
