/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the example
  const headerRow = ['Carousel (carousel15)'];
  // Find the carousel content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  const rows = items.map((item) => {
    // IMAGE CELL: find .image > img
    let imageCell = null;
    const imageWrap = item.querySelector('.image');
    if (imageWrap) {
      const img = imageWrap.querySelector('img');
      if (img) imageCell = img;
    }
    // TEXT CELL: everything in the slide NOT inside .image
    let textCell = '';
    // Collect ALL child nodes of the slide that are not part of the .image container
    const nodeList = Array.from(item.childNodes).filter(child => {
      return !(child.nodeType === 1 && child.classList.contains('image'));
    });
    // If there is no direct text, look inside .image siblings for any content
    // For flexibility, if nothing found try to find any heading, p, a, ul, ol inside the item except inside .image
    if (nodeList.length === 0) {
      const extra = Array.from(item.querySelectorAll(':scope > *:not(.image)'));
      nodeList.push(...extra);
    }
    // Remove empty text nodes
    const relevantNodes = nodeList.filter(node => {
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      if (node.nodeType === 1) return true;
      return false;
    });
    // If there's anything left, use it; else leave empty
    if (relevantNodes.length > 0) {
      textCell = relevantNodes;
    }
    return [imageCell, textCell];
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
