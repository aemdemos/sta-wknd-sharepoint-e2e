/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel36)'];
  const rows = [];

  // Find the cmp-carousel inside the root element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  items.forEach(item => {
    // 1st cell: image element (first <img> descendant)
    const img = item.querySelector('img');

    // 2nd cell: gather all non-image content, robust for future slides with text or CTA
    let textNodes = [];
    // Collect all child nodes that are not the .image container
    Array.from(item.childNodes).forEach(node => {
      if (
        node.nodeType === 1 && node.classList && node.classList.contains('image')
      ) {
        // skip image container
        return;
      }
      if (
        node.nodeType === 3 && node.textContent.trim() === ''
      ) {
        // skip empty text nodes
        return;
      }
      textNodes.push(node);
    });
    // Remove empty text nodes or whitespace-only nodes
    textNodes = textNodes.filter(node => {
      if (typeof node === 'string') return node.trim().length > 0;
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      if (node.nodeType === 1 && node.textContent.trim().length === 0) return false;
      return true;
    });
    // If there's no non-image content, use empty string
    const textCell = textNodes.length > 0 ? textNodes : '';
    rows.push([img || '', textCell]);
  });

  // Compose block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);
  // Replace the original element with the table block
  element.replaceWith(table);
}
