/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first direct child with a class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. Table header
  const headerRow = ['Carousel (carousel30)'];
  const rows = [headerRow];

  // 2. Find the carousel content container
  const carousel = getDirectChildByClass(element, 'cmp-carousel');
  if (!carousel) return;
  const content = getDirectChildByClass(carousel, 'cmp-carousel__content');
  if (!content) return;

  // 3. Find all slides (cmp-carousel__item)
  const items = Array.from(content.children).filter(c => c.classList.contains('cmp-carousel__item'));

  items.forEach(item => {
    // Find image (mandatory)
    let imgEl = null;
    const imageWrapper = getDirectChildByClass(item, 'image');
    if (imageWrapper) {
      const cmpImage = getDirectChildByClass(imageWrapper, 'cmp-image');
      if (cmpImage) {
        imgEl = cmpImage.querySelector('img');
      }
    }
    if (!imgEl) return;

    // Try to extract text content from the slide
    let textContent = '';
    // Find heading (h1, h2, h3, h4, h5, h6)
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textContent += `<strong>${heading.textContent.trim()}</strong>`;
    }
    // Find paragraphs or other text blocks
    const paragraphs = Array.from(item.querySelectorAll('p'));
    if (paragraphs.length) {
      paragraphs.forEach(p => {
        textContent += `<div>${p.textContent.trim()}</div>`;
      });
    }
    // If no heading/paragraphs, look for direct text nodes
    if (!textContent) {
      const directText = Array.from(item.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        .map(n => n.textContent.trim()).join(' ');
      if (directText) {
        textContent = directText;
      }
    }

    // Only push two columns if there is text content, otherwise just the image (no empty column)
    if (textContent) {
      rows.push([imgEl, textContent]);
    } else {
      rows.push([imgEl]);
    }
  });

  // 4. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
