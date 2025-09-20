/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and all text content from a carousel slide
  function extractSlideContent(carouselItem) {
    let img = carouselItem.querySelector('img');
    if (!img) {
      const cmpImage = carouselItem.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        img = cmpImage.querySelector('img');
      }
    }
    const imageCell = img ? img : '';
    // Collect all text nodes and elements except image
    const textCellFragments = [];
    Array.from(carouselItem.children).forEach(child => {
      if (!child.matches('.image, [data-cmp-is="image"]')) {
        if (child.textContent.trim() || child.querySelector('a')) {
          textCellFragments.push(child);
        }
      }
    });
    if (textCellFragments.length === 0) {
      // Get all text nodes except inside .image
      const walker = document.createTreeWalker(carouselItem, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
          if (node.closest('.image, [data-cmp-is="image"]')) return NodeFilter.FILTER_SKIP;
          if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_SKIP;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        textCellFragments.push(node);
      }
    }
    // Only return a second cell if there is text content
    if (textCellFragments.length) {
      return [imageCell, textCellFragments];
    } else {
      return [imageCell];
    }
  }

  // Get all carousel blocks in the element
  const carousels = Array.from(element.querySelectorAll(':scope > div > div.cmp-carousel'));
  if (carousels.length === 0) {
    carousels.push(...element.querySelectorAll('.cmp-carousel'));
  }

  const rows = [];
  const headerRow = ['Carousel (carousel18)'];
  rows.push(headerRow);

  carousels.forEach(carousel => {
    const items = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
    items.forEach(item => {
      // Only add a second column if there is text content
      const slideRow = extractSlideContent(item);
      rows.push(slideRow);
    });
  });

  // Remove unnecessary empty columns (if no text, only image cell)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 2 && (rows[i][1] === '' || (Array.isArray(rows[i][1]) && rows[i][1].length === 0))) {
      rows[i].pop();
    }
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
