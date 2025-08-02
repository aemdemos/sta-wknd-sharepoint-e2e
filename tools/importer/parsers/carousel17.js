/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Carousel (carousel17)'];

  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel slides
  const slides = content.querySelectorAll('.cmp-carousel__item');
  const rows = Array.from(slides).map((slide) => {
    // IMAGE CELL (first column): first <img> inside the slide
    let imageEl = slide.querySelector('img');
    let imageCell = imageEl || '';

    // TEXT CELL (second column):
    // Collect ALL content not within the .image container (and not the .image itself)
    let textCellNodes = [];
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) {
        // skip image container
        return;
      }
      // If it's an element or a text node with non-whitespace
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
      ) {
        textCellNodes.push(node);
      }
    });
    // If no text nodes, insert an empty string to make sure the table is correct
    let textCell;
    if (textCellNodes.length === 0) {
      textCell = '';
    } else if (textCellNodes.length === 1) {
      textCell = textCellNodes[0];
    } else {
      textCell = textCellNodes;
    }
    return [imageCell, textCell];
  });

  // Compose table: header (1 col), then slide rows (2 cols)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
