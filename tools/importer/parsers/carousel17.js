/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-carousel element
  const carousel = element.querySelector('.cmp-carousel') || element;
  // Find all carousel slide items
  const content = carousel.querySelector('.cmp-carousel__content') || carousel;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  const rows = [
    ['Carousel (carousel17)'],
  ];

  items.forEach(item => {
    // --- Extract image (first column) ---
    let imageCell = null;
    const cmpImage = item.querySelector('.cmp-image');
    if (cmpImage) {
      imageCell = cmpImage;
    } else {
      const img = item.querySelector('img');
      if (img) imageCell = img;
    }

    // --- Extract text (second column) ---
    // Gather all non-image direct children
    const textNodes = [];
    Array.from(item.children).forEach(child => {
      // Exclude elements that are image containers
      if (
        child.classList.contains('image') ||
        child.classList.contains('cmp-image') ||
        child.querySelector('img')
      ) {
        return;
      }
      // Include if the element has visible text or children
      if (child.textContent && child.textContent.trim().length > 0) {
        textNodes.push(child);
      }
    });
    // Also check for stray text nodes (not wrapped in an element)
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    // Compose text cell
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    }
    rows.push([imageCell, textCell]);
  });

  // Ensure all non-header rows have two columns
  for (let i = 1; i < rows.length; i++) {
    while (rows[i].length < 2) rows[i].push('');
  }

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
