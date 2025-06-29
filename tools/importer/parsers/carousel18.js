/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel element inside the provided block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Prepare rows, start with the header row
  const rows = [['Carousel (carousel18)']];

  // Find all carousel items
  const items = carousel.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // First cell: the image (look for .cmp-image inside .image)
    let imageCell = '';
    const imageWrapper = item.querySelector('.image .cmp-image');
    if (imageWrapper) imageCell = imageWrapper;

    // Second cell: any text content except the image
    // Gather all elements and text nodes that are not the image container
    const textNodes = [];
    Array.from(item.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('image')) return; // Skip image container
      if (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) return; // Skip empty text
      textNodes.push(child);
    });
    let textCell = '';
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      const frag = document.createDocumentFragment();
      textNodes.forEach(n => frag.appendChild(n));
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
