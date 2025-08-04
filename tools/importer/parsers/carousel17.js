/* global WebImporter */
export default function parse(element, { document }) {
  // Header row is always a single-cell per example
  const headerRow = ['Carousel (carousel17)'];

  // Get the carousel main element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Get the slide container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Compose rows for each slide
  const slideRows = items.map((item) => {
    // Get image cell
    let imageCell = '';
    const imageDiv = item.querySelector('.image');
    if (imageDiv) {
      const cmpImage = imageDiv.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      } else {
        const imgEl = imageDiv.querySelector('img');
        if (imgEl) imageCell = imgEl;
      }
    }
    // Get text cell (all content outside .image)
    let textCell = null;
    const nonImageNodes = Array.from(item.childNodes).filter((n) => {
      return !(n.nodeType === 1 && n.classList.contains('image')) && (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    });
    if (nonImageNodes.length > 0) {
      // For text nodes, wrap in <p> for structure
      textCell = nonImageNodes.map((n) => {
        if (n.nodeType === 3) {
          const p = document.createElement('p');
          p.textContent = n.textContent.trim();
          return p;
        }
        return n;
      });
    } else {
      textCell = undefined; // Do not provide a second cell if empty
    }
    // If there is text content, two-column row; else, single-column row
    if (textCell !== undefined) {
      return [imageCell, textCell];
    } else {
      return [imageCell];
    }
  });

  // Compose final cells array: header row, then slide rows
  const cells = [headerRow, ...slideRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
