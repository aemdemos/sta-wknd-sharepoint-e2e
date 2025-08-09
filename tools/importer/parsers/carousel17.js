/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  const rows = [['Carousel (carousel17)']]; // Header row – exactly as example

  slides.forEach(slide => {
    let img = null;
    let textCell = '';
    // Find image
    const imageContainer = slide.querySelector('.image');
    if (imageContainer) {
      img = imageContainer.querySelector('img');
    }
    // Gather all non-image content
    const nonImageNodes = [];
    slide.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) return;
      if ((node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        nonImageNodes.push(node);
      }
    });
    // If there's text content, group it
    if (nonImageNodes.length === 1) {
      textCell = nonImageNodes[0];
    } else if (nonImageNodes.length > 1) {
      const wrap = document.createElement('div');
      nonImageNodes.forEach(n => wrap.appendChild(n));
      textCell = wrap;
    }
    // Always produce two columns per row, matching the example structure
    rows.push([img ? img : '', textCell ? textCell : '']);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
