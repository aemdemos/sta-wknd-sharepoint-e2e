/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Determine the correct column count based on the first item
  let maxCols = 2; // Always 2, as per example: image + text

  // Create header row with correct colspan
  const th = document.createElement('th');
  th.textContent = 'Carousel (carousel8)';
  if (maxCols > 1) th.setAttribute('colspan', maxCols);
  const rows = [[th]];

  items.forEach(item => {
    // Find image container
    let imgCell = null;
    const imgWrap = item.querySelector('.cmp-image') || item.querySelector('img');
    if (imgWrap) imgCell = imgWrap;
    // Gather all top-level children not part of .image/.cmp-image to preserve text content
    let textElements = [];
    Array.from(item.children).forEach(child => {
      if (!(child.classList && (child.classList.contains('cmp-image') || child.classList.contains('image')))) {
        textElements.push(child);
      }
    });
    const textCell = textElements.length ? textElements : '';
    rows.push([imgCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
