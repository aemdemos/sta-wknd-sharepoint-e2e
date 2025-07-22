/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel component
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find carousel items/slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build rows for each slide
  const rows = items.map((item) => {
    // Find image cell (always present)
    let imageCell = '';
    const imageBlock = item.querySelector('.image');
    if (imageBlock) {
      imageCell = imageBlock;
    } else {
      const img = item.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: collect all content that's not the image
    const textContent = [];
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image')) {
        textContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        // Wrap text in <p> for semantics
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textContent.push(p);
      }
    });
    // Create a two-column row: always two columns for carousel15, even if no text content
    return [imageCell, textContent.length > 0 ? textContent : ''];
  });

  // The header row is always a single cell, for the block name
  const cells = [
    ['Carousel (carousel15)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
