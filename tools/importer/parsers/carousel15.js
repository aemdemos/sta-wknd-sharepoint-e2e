/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // All direct slide items
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const cells = [];
  // Header row: single cell, matches example
  cells.push(['Carousel (carousel15)']);

  // Each slide: [image, text-content (if any)]
  slides.forEach((slide) => {
    // Get the image element (if any)
    const imgEl = slide.querySelector('img');

    // Gather any content that is not the image itself
    // Look for direct children that are not the image container
    const textEls = Array.from(slide.children).filter(child => !child.classList.contains('image'));
    let textCell = '';
    if (textEls.length > 0) {
      // If there is real content, include all those elements as the text cell
      textCell = textEls;
    }
    cells.push([imgEl, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Set colspan on header if the table has more than one column
  const headerRow = table.querySelector('tr:first-child');
  const firstDataRowLen = (cells[1] || []).length;
  if (headerRow && headerRow.children.length === 1 && firstDataRowLen > 1) {
    headerRow.children[0].setAttribute('colspan', String(firstDataRowLen));
  }

  // Replace original element with the new table
  element.replaceWith(table);
}
