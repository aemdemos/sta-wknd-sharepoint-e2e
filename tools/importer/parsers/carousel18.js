/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const cells = [['Carousel (carousel18)']];

  // Find the carousel items
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // --- IMAGE CELL ---
    let imgCell = null;
    const img = item.querySelector('img');
    if (img) imgCell = img;

    // --- TEXT CELL ---
    // Collect all direct children that are not image containers
    const textNodes = [];
    Array.from(item.children).forEach((child) => {
      if (!(child.classList && child.classList.contains('image'))) {
        // Only push if the content isn't empty
        if (child.textContent.trim() || child.querySelectorAll('a,button,ul,ol,li').length) {
          textNodes.push(child);
        }
      }
    });
    let textCell = '';
    if (textNodes.length > 0) {
      textCell = textNodes;
    }

    cells.push([imgCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
