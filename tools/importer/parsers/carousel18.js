/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Prepare rows for the table. Header row is always first and single cell
  const rows = [['Carousel (carousel18)']];

  // Find all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    // IMAGE CELL: first <img> in the slide
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // TEXT CELL: collect all direct children of slide that are not part of the image container
    const textNodes = [];
    Array.from(slide.children).forEach((child) => {
      // skip the image container
      if (!child.classList.contains('image')) {
        // For robustness: collect all child nodes (not just elements), including text nodes
        Array.from(child.childNodes).forEach((node) => {
          // skip empty text nodes
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
          textNodes.push(node);
        });
        // If no child nodes (e.g. plain <span>), still add the element
        if (!child.childNodes.length) {
          textNodes.push(child);
        }
      }
    });
    // If nothing, cell is ''
    const textCell = textNodes.length > 0 ? textNodes : '';
    rows.push([imageCell, textCell]);
  });

  // Create and replace with the new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
