/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  // Find the carousel content wrapper
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all direct carousel items (slides)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build the table rows
  const rows = [['Carousel (carousel22)']]; // Header matches the example exactly

  items.forEach(item => {
    // Try to find the teaser inside the item
    const teaser = item.querySelector('.cmp-teaser');

    // --- First column: image ---
    let img = null;
    if (teaser) {
      const imgWrapper = teaser.querySelector('.cmp-teaser__image');
      if (imgWrapper) {
        // Only include the <img> element directly, not any wrapping divs
        img = imgWrapper.querySelector('img');
      }
    }

    // --- Second column: text content ---
    let textElements = [];
    if (teaser) {
      const contentDiv = teaser.querySelector('.cmp-teaser__content');
      if (contentDiv) {
        // Title (h2)
        const h2 = contentDiv.querySelector('h2');
        if (h2) textElements.push(h2);
        // Description (could be plain div or contain a <p>)
        const desc = contentDiv.querySelector('.cmp-teaser__description');
        if (desc) textElements.push(desc);
        // CTA link
        const cta = contentDiv.querySelector('.cmp-teaser__action-container a');
        if (cta) textElements.push(cta);
      }
    }
    // If there is no teaser or content, ensure empty cell but maintain 2 columns
    rows.push([
      img || '',
      textElements.length > 0 ? (textElements.length === 1 ? textElements[0] : textElements) : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
