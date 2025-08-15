/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Header row: only one cell, to match the example exactly
  const cells = [['Carousel (carousel17)']];

  items.forEach((item) => {
    // Image cell: first <img>
    const img = item.querySelector('img');
    const imageCell = img || '';

    // Text cell: collect all non-image text content
    let textElements = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image') && !child.classList.contains('cmp-image')) {
        const candidates = child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,ul,ol,span,div');
        Array.from(candidates).forEach(el => {
          if (el.textContent.trim()) {
            textElements.push(el);
          }
        });
        if (child.matches('h1,h2,h3,h4,h5,h6,p,a,ul,ol,span,div') && child.textContent.trim()) {
          textElements.push(child);
        }
      }
    });
    const textCell = textElements.length > 0 ? textElements : '';
    cells.push([imageCell, textCell]);
  });

  // Replace original element with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
