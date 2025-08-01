/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header as specified
  const cells = [['Carousel (carousel18)']];

  items.forEach(item => {
    // Image extraction
    let image = null;
    const imageWrap = item.querySelector('.image');
    if (imageWrap) image = imageWrap.querySelector('img');

    // Gather all non-image content (text, headings, CTA, etc)
    const textNodes = Array.from(item.children)
      .filter(child => !child.classList.contains('image'))
      .map(child => child)
      .filter(node => {
        // Only keep nodes with meaningful content
        return node.textContent && node.textContent.trim().length > 0;
      });
    // Also check for captions directly inside .image (future-proof)
    if (imageWrap) {
      Array.from(imageWrap.children).forEach(child => {
        if (child.tagName && child.tagName.toLowerCase() !== 'img' && child.textContent && child.textContent.trim().length > 0) {
          textNodes.push(child);
        }
      });
    }

    // Construct cells for this row
    if (image && textNodes.length > 0) {
      cells.push([image, textNodes.length === 1 ? textNodes[0] : textNodes]);
    } else if (image) {
      cells.push([image]);
    } else if (textNodes.length > 0) {
      cells.push([textNodes.length === 1 ? textNodes[0] : textNodes]);
    }
  });

  // Replace with constructed block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
