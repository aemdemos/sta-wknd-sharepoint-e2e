/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, even for a two-column table.
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Find carousel and all slides
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  items.forEach((item) => {
    // Find main image (first img in the slide)
    const imgEl = item.querySelector('img');

    // Collect all text content inside the slide except for image
    let textEls = [];
    Array.from(item.children).forEach((child) => {
      if (!child.querySelector('img')) {
        if (child.textContent.trim()) {
          textEls.push(child);
        }
      }
    });
    // If no text found, check image attributes for title/alt
    if (textEls.length === 0 && imgEl) {
      let bestText = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';
      if (bestText) {
        const heading = document.createElement('h3');
        heading.textContent = bestText;
        textEls.push(heading);
      }
    }
    // Ensure two columns in each content row
    rows.push([
      imgEl || '',
      textEls.length > 1 ? textEls : (textEls[0] || '')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Make sure the header row cell spans two columns (matches example structure)
  if (table.rows.length > 0 && table.rows[0].cells.length === 1) {
    table.rows[0].cells[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
