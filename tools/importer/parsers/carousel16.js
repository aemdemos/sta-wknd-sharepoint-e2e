/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from the slide
  function getImageEl(item) {
    const img = item.querySelector('img');
    return img || null;
  }
  // Helper to extract all text content not in the image wrapper
  function getTextContent(item) {
    // Remove image wrappers from consideration
    const imageWrappers = Array.from(item.querySelectorAll('.image, [data-cmp-is="image"]'));
    // Gather all nodes that are not image wrappers or their descendants
    const textNodes = [];
    Array.from(item.childNodes).forEach((node) => {
      let isInImage = false;
      for (const wrapper of imageWrappers) {
        if (wrapper === node || (node.nodeType === 1 && wrapper.contains(node))) {
          isInImage = true;
          break;
        }
      }
      // Exclude images themselves
      if (!isInImage && !(node.nodeType === 1 && node.tagName === 'IMG')) {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
          textNodes.push(node);
        }
      }
    });
    return textNodes;
  }
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const items = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');
  const cells = [['Carousel (carousel16)']];
  items.forEach((item) => {
    const imgEl = getImageEl(item);
    const textEls = getTextContent(item);
    if (imgEl && textEls.length > 0) {
      cells.push([imgEl, textEls.length === 1 ? textEls[0] : textEls]);
    } else if (imgEl) {
      cells.push([imgEl]);
    } else if (textEls.length > 0) {
      cells.push([textEls.length === 1 ? textEls[0] : textEls]);
    }
  });
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
