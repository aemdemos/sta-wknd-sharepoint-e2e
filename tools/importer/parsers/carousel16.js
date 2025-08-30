/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly one column, exactly matching the example
  const headerRow = ['Carousel (carousel16)'];

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Locate all carousel items/slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.children).filter(el => el.classList.contains('cmp-carousel__item'));

  // Each slide is a row with a single cell (one column): an array of [image, text] elements
  const rows = items.map(item => {
    // --- Find image element ---
    let imageElem = '';
    const cmpImage = item.querySelector('.cmp-image');
    if (cmpImage) {
      imageElem = cmpImage;
    } else {
      const img = item.querySelector('img');
      if (img) imageElem = img;
    }

    // --- Gather text content (all non-image content) ---
    let textElems = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image')) {
        if (child.textContent.trim() || child.children.length > 0) {
          textElems.push(child);
        }
      }
    });
    // If no block-level text found, check for text nodes directly inside the item
    if (textElems.length === 0) {
      Array.from(item.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textElems.push(span);
        }
      });
    }

    // Compose the cell content: image, then text (if present)
    const cellContent = textElems.length > 0 ? [imageElem, ...textElems] : [imageElem];
    // Each slide row must be a one-item array containing all content for the cell
    return [cellContent];
  });

  // Final table: header row, then slide rows, all with a single column
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
