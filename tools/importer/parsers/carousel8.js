/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // 2. Build table header exactly as in example
  const cells = [['Carousel (carousel8)']];

  // 3. Parse each slide (cmp-carousel__item)
  const items = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  items.forEach(item => {
    // Extract image (first cell)
    let image = item.querySelector('img');

    // Extract text content (second cell)
    // Find all children of .cmp-carousel__item that are NOT the image wrapper
    const imageWrappers = Array.from(item.querySelectorAll('.image'));
    const otherChildren = Array.from(item.children).filter(child => !imageWrappers.includes(child));
    // Also include direct text nodes (not inside image)
    const textNodes = Array.from(item.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    // Compose text content cell
    const textFragments = [];
    // Add non-image children (blocks, headings, etc)
    otherChildren.forEach(child => textFragments.push(child));
    // Add direct text nodes as paragraphs
    textNodes.forEach(node => {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      textFragments.push(p);
    });
    // Prepare cell content
    const textCell = textFragments.length === 0 ? '' : (textFragments.length === 1 ? textFragments[0] : textFragments);

    cells.push([image || '', textCell]);
  });

  // 4. Replace original element with new table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
