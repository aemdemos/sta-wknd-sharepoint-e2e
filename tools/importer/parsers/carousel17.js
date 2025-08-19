/* global WebImporter */
export default function parse(element, { document }) {
  // Header as in the example, always a single cell
  const header = ['Carousel (carousel17)'];

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel slides/items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  const rows = [];
  items.forEach(item => {
    // --- IMAGE CELL ---
    let image = item.querySelector('img.cmp-image__image');
    if (!image) {
      // fallback for alternate structure
      const imgWrap = item.querySelector('[data-cmp-hook-image="imageV3"]');
      if (imgWrap) image = imgWrap.querySelector('img');
    }
    if (!image) return; // image is mandatory

    // --- TEXT CELL ---
    // Collect all direct children of the slide except the image wrapper(s)
    // Slides can have .image and potentially other text containers
    const elements = Array.from(item.children);
    const textElements = elements.filter(child => {
      // Exclude nodes containing the image
      if (child.querySelector && child.querySelector('img.cmp-image__image')) return false;
      // Exclude container with imageV3 if present
      if (child.getAttribute && child.getAttribute('data-cmp-is') === 'image') return false;
      // Otherwise, include
      return true;
    });
    // If any text content exists, group them in cell; else empty string
    let textCell = '';
    if (textElements.length === 1) {
      textCell = textElements[0];
    } else if (textElements.length > 1) {
      textCell = textElements;
    } // else remains ''

    rows.push([image, textCell]);
  });

  // Table rows: first is header, then each slide row
  const cells = [header, ...rows];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
