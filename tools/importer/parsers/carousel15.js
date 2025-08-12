/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as needed
  const headerRow = ['Carousel (carousel15)'];

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides/items (each is a row)
  const items = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
  const rows = [];

  items.forEach(item => {
    // Column 1: Image
    let img = null;
    let imgContainer = item.querySelector('.image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    if (!img) {
      img = item.querySelector('img'); // fallback
    }

    // Column 2: Text content (robust extraction)
    // Collect all elements (at any depth) that are not images
    // and are not part of carousel controls/indicators
    const excludeClasses = ['image', 'cmp-carousel__actions', 'cmp-carousel__indicators'];
    let textContentElements = [];

    // Helper: Recursively collect non-image and non-control elements with text
    function collectTextNodes(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Exclude image containers and carousel controls/indicators
        if (excludeClasses.some(cls => node.classList.contains(cls))) {
          return;
        }
        // Exclude img tags
        if (node.tagName === 'IMG') {
          return;
        }
        // If this node has text, and isn't excluded, add it
        if (node.textContent.trim() && node.children.length === 0) {
          textContentElements.push(node);
        } else {
          // Recursively check children
          Array.from(node.childNodes).forEach(collectTextNodes);
        }
      }
    }
    collectTextNodes(item);

    // If no text content found, keep cell empty string
    // If there's only one block, use that directly, else use array
    const textCell = textContentElements.length === 0
      ? ''
      : (textContentElements.length === 1 ? textContentElements[0] : textContentElements);

    rows.push([img, textCell]);
  });

  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
