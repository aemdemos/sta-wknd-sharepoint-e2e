/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the table rows
  // Header row: exactly one column with the header text
  const rows = [['Carousel (carousel8)']];

  // Find the carousel element
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) carousel = element;
  if (!carousel) return;

  // Get the carousel slides/items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  // Each subsequent row: exactly two columns (image, text)
  items.forEach(item => {
    // First cell: image container or img element
    let imageCell = '';
    const imageDiv = item.querySelector('.image');
    if (imageDiv) {
      imageCell = imageDiv;
    } else {
      const img = item.querySelector('img');
      if (img) imageCell = img;
    }

    // Second cell: all non-image content (preserve order)
    let textCell = '';
    const textNodes = [];
    // Only consider direct children of the slide, exclude imageDiv
    Array.from(item.children).forEach(child => {
      if (imageDiv && (child === imageDiv || imageDiv.contains(child))) return;
      if (child.tagName && !child.querySelector('img')) textNodes.push(child);
    });
    // Include text nodes that aren't whitespace
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    if (textNodes.length > 0) textCell = textNodes;
    rows.push([imageCell, textCell]);
  });

  // Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Adjust the first header row to have colspan=2 so it spans both columns visually
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1 && items.length) {
    headerTr.firstElementChild.setAttribute('colspan', '2');
  }

  // Replace the original element with the new table
  element.replaceWith(table);
}
