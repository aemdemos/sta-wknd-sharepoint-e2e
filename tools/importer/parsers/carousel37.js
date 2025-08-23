/* global WebImporter */
export default function parse(element, { document }) {
  // Header row -- matches example markdown EXACTLY
  const headerRow = ['Carousel (carousel37)'];

  // Find the main carousel block within the element
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;
  
  // Find the carousel slide container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slide items
  const slideNodes = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // For each slide, extract the image (first cell) and all non-image content (second cell)
  const rows = slideNodes.map(slide => {
    // IMAGE: Get the first <img> inside the slide
    let imgEl = null;
    // Try direct .cmp-image, fallback to [data-cmp-is="image"]
    let imgWrappers = slide.querySelectorAll('.cmp-image, [data-cmp-is="image"]');
    if (imgWrappers.length > 0) {
      imgEl = imgWrappers[0].querySelector('img');
    }

    // TEXT: Collect all direct children of slide except any image containers
    let textEls = [];
    Array.from(slide.children).forEach(child => {
      // Skip image wrappers
      if (
        child.classList.contains('image') ||
        child.classList.contains('cmp-image') ||
        child.getAttribute('data-cmp-is') === 'image'
      ) {
        return;
      }
      // Only add non-empty elements/text
      if (child.nodeType === 1 && child.textContent.trim() !== '') {
        textEls.push(child);
      }
      if (child.nodeType === 3 && child.textContent.trim() !== '') {
        // Wrap text node in <span> to preserve formatting
        const span = document.createElement('span');
        span.textContent = child.textContent.trim();
        textEls.push(span);
      }
    });
    // If no text content, cell should be empty string
    let textCell = textEls.length === 0 ? '' : textEls.length === 1 ? textEls[0] : textEls;
    return [imgEl, textCell];
  });

  // Build the table: header + rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
