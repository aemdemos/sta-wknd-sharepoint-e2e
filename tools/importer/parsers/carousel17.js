/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel block root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Header - must match example precisely
  const rows = [['Carousel (carousel17)']];

  slides.forEach(slide => {
    // IMAGE CELL: Find the first <img> element (guaranteed to exist per spec)
    const img = slide.querySelector('img');

    // TEXT CELL: Gather all content that is NOT inside the image block
    // Sometimes text is in direct child elements, sometimes elsewhere
    // This approach collects all non-image children
    const textNodes = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image') && child.textContent.trim()) {
        textNodes.push(child);
      }
      // If .image block, also check its siblings for text
      if (child.classList.contains('image')) {
        let sib = child.nextElementSibling;
        while (sib) {
          if (sib.textContent.trim()) textNodes.push(sib);
          sib = sib.nextElementSibling;
        }
      }
    });
    // If no text found, cell is empty string
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    rows.push([img, textCell]);
  });

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
