/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the block header row, exactly as in the example
  const headerRow = ['Carousel (carousel8)'];
  const table = [headerRow];

  // Find the main carousel structure
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Extract all slides (each .cmp-carousel__item)
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  slides.forEach(slide => {
    // Find image (first cell)
    const img = slide.querySelector('img, picture');

    // Find text content (second cell)
    // Consider all children of the slide except those in the image wrapper
    const imageWrapper = slide.querySelector('.image');
    const textContentElements = [];
    Array.from(slide.childNodes).forEach(node => {
      // Exclude the image wrapper and whitespace-only text nodes
      if (node !== imageWrapper && !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())) {
        textContentElements.push(node);
      }
    });

    // Remove image nodes from text content if they exist
    const filteredTextContent = textContentElements.filter(node => {
      // Remove anything that is (or contains) an <img> or <picture>
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName.toLowerCase() === 'img' || node.tagName.toLowerCase() === 'picture' || node.querySelector('img, picture')) {
          return false;
        }
      }
      return true;
    });
    // Only add text cell if there is meaningful text content
    let textCell = null;
    if (filteredTextContent.length > 0) {
      textCell = filteredTextContent.length === 1 ? filteredTextContent[0] : filteredTextContent;
    }

    // Compose row: if no text, only include image cell (1 col), else both (2 cols)
    if (img && textCell) {
      table.push([img, textCell]);
    } else if (img) {
      table.push([img]);
    } else if (textCell) {
      table.push(['', textCell]);
    }
    // If neither, skip row
  });

  // Replace the original element with the created block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}