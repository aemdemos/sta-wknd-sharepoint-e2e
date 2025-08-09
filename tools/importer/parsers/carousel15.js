/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Carousel (carousel15)'];
  const cells = [headerRow];

  // Find the carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slide items
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // IMAGE CELL: Select the first <img> in this slide
    let imgEl = item.querySelector('img');
    if (!imgEl) {
      imgEl = document.createElement('span');
    }

    // TEXT CELL: Gather all content in the slide that is NOT inside the image wrapper
    // Find .image wrapper, then collect all siblings after .image as text content
    let textCell = '';
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      // Gather all siblings after imageWrapper
      let sibling = imageWrapper.nextSibling;
      const nodeArray = [];
      while (sibling) {
        // Only include nodes with text, or element nodes
        if ((sibling.nodeType === 1 && sibling.textContent.trim()) ||
            (sibling.nodeType === 3 && sibling.textContent.trim())) {
          nodeArray.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
      if (nodeArray.length > 0) {
        textCell = nodeArray;
      }
    } else {
      // If no image wrapper, but there are multiple children, gather everything except the image
      const nodeArray = [];
      Array.from(item.childNodes).forEach((child) => {
        if (child.nodeType === 1 && child.tagName !== 'IMG' && (!child.classList || !child.classList.contains('image'))) {
          if (child.textContent.trim()) nodeArray.push(child);
        } else if (child.nodeType === 3 && child.textContent.trim()) {
          nodeArray.push(child);
        }
      });
      if (nodeArray.length > 0) {
        textCell = nodeArray;
      }
    }
    cells.push([imgEl, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
