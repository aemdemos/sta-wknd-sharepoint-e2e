/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the example
  const cells = [['Carousel (carousel15)']];

  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel slide items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // IMAGE CELL
    let imgCell = null;
    const imageDiv = item.querySelector('.image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) imgCell = img;
    }

    // TEXT CELL
    // Gather all direct children that are not the image div
    const textBlocks = [];
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        // Only push if it's not empty
        if ((child.nodeType === 1 && child.innerText.trim().length > 0) || (child.nodeType === 3 && child.textContent.trim().length > 0)) {
          textBlocks.push(child);
        }
      }
    });

    // Also gather inline text nodes directly under the item (between elements)
    Array.from(item.childNodes).forEach((child) => {
      if (child.nodeType === 3 && child.textContent.trim().length > 0) {
        // Wrap in p element for consistency
        const p = document.createElement('p');
        p.textContent = child.textContent.trim();
        textBlocks.push(p);
      }
    });

    // Compose row
    if (textBlocks.length > 0) {
      cells.push([imgCell, textBlocks]);
    } else {
      cells.push([imgCell]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
