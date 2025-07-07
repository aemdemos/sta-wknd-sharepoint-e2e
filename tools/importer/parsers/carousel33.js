/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  const rows = [['Carousel (carousel33)']];
  items.forEach((item) => {
    // First column: image
    const img = item.querySelector('img');
    const imgCell = img || '';
    // Second column: text content
    // Get all direct children except the one containing the image
    let textBlocks = [];
    Array.from(item.children).forEach(child => {
      if (child.querySelector('img')) return;
      // collect all child nodes that are not images and are meaningful (not empty text)
      Array.from(child.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.tagName.toLowerCase() !== 'img') {
          textBlocks.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim() !== '') {
          textBlocks.push(document.createTextNode(node.textContent));
        }
      });
    });
    // Also check for any direct text nodes under the item
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim() !== '') {
        textBlocks.push(document.createTextNode(node.textContent));
      }
    });
    let textCell = '';
    if (textBlocks.length === 1) textCell = textBlocks[0];
    else if (textBlocks.length > 1) textCell = textBlocks;
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
