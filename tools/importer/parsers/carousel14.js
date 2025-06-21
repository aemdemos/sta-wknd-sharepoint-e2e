/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) {
    if (element.classList.contains('cmp-carousel')) carousel = element;
    else return;
  }
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!slides.length) return;

  // Header row: must match the example exactly
  const rows = [['Carousel (carousel14)']];

  // For each slide, get the image in the first cell, ALL other content in the second cell (except the image)
  slides.forEach((slide) => {
    // IMAGE: first <img> in slide
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // TEXT: Reference all content in the slide except the image
    // We'll collect all nodes except the images and their parent wrappers
    const textNodes = [];
    // Direct children of the slide
    Array.from(slide.childNodes).forEach((child) => {
      if (child.nodeType === 1) { // element node
        // If this is the image wrapper (e.g., <div class="image">), skip it
        if (child.querySelector('img')) return;
        if (child.classList.contains('image')) return;
        // Otherwise, include it if it has content
        if (child.textContent.trim() !== '' || child.querySelector('a, h1, h2, h3, h4, h5, h6, p')) {
          textNodes.push(child);
        }
      } else if (child.nodeType === 3 && child.textContent.trim() !== '') {
        // Text node
        textNodes.push(child);
      }
    });
    // If nothing yet, check inside the slide for any additional elements after the image wrapper
    if (!textNodes.length) {
      Array.from(slide.querySelectorAll(':scope > *')).forEach((child) => {
        if (!child.querySelector('img') && child.textContent.trim() !== '') {
          textNodes.push(child);
        }
      });
    }
    // If still empty, check for text content not inside image wrappers
    if (!textNodes.length) {
      const slideClone = slide.cloneNode(true);
      Array.from(slideClone.querySelectorAll('img,.image')).forEach(n => n.remove());
      if (slideClone.textContent.trim() !== '') {
        const span = document.createElement('span');
        span.textContent = slideClone.textContent.trim();
        textNodes.push(span);
      }
    }
    // If still empty, just use blank
    const textCell = textNodes.length ? (textNodes.length === 1 ? textNodes[0] : textNodes) : '';
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
