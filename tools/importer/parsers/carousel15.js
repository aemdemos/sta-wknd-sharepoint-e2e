/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, must match block name exactly
  const cells = [['Carousel (carousel15)']];

  // Find the carousel in the element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  slides.forEach((slide) => {
    // First cell: image container
    let imgCell = null;
    const cmpImage = slide.querySelector('.cmp-image');
    if (cmpImage) {
      imgCell = cmpImage;
    } else {
      const imageDiv = slide.querySelector('.image');
      if (imageDiv) {
        imgCell = imageDiv;
      } else {
        const img = slide.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Second cell: all non-image content from the slide
    // We'll collect all elements except ones that are images or image containers
    const nonImgContent = [];
    // Only consider direct children (to prevent duplicating nested image containers)
    Array.from(slide.children).forEach(child => {
      if (
        child.classList.contains('cmp-image') ||
        child.classList.contains('image') ||
        child.tagName.toLowerCase() === 'img'
      ) {
        // skip image containers
        return;
      }
      // If child has visible text or childNodes, include
      if ((child.textContent && child.textContent.trim().length > 0) || child.childElementCount > 0) {
        nonImgContent.push(child);
      }
    });
    // If no direct non-image elements, look for text content in subtree
    if (nonImgContent.length === 0) {
      // Find any text nodes not inside an image container
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
          if (
            node.classList &&
            (node.classList.contains('cmp-image') || node.classList.contains('image'))
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.trim().length > 0) {
          // Only include block-level elements with visible text
          if (/^h[1-6]$/.test(node.tagName.toLowerCase()) || node.tagName.toLowerCase() === 'p' || node.tagName.toLowerCase() === 'a') {
            if (!nonImgContent.includes(node)) nonImgContent.push(node);
          }
        }
      }
    }
    let textCell = '';
    if (nonImgContent.length > 0) {
      textCell = nonImgContent;
    }
    cells.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
