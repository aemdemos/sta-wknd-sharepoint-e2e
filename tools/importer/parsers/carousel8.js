/* global WebImporter */
export default function parse(element, { document }) {
  // Create table rows array
  const rows = [];

  // Header row: block name as a single cell, EXACTLY as in the example
  rows.push(['Carousel (carousel8)']);

  // Locate the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find carousel__content container
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  // Get all slides
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  items.forEach(item => {
    // 1. Image cell: first image inside .image
    const imgElem = item.querySelector('.image img');
    const firstCell = imgElem ? imgElem : '';
    
    // 2. Text cell: Collect all non-image, visible direct children (headings, paragraphs, links, etc)
    let textElems = [];
    Array.from(item.children).forEach(child => {
      if (!child.classList.contains('image') && child.textContent.trim()) {
        textElems.push(child);
      }
    });
    // If no direct children, look deeper for semantic content outside .image
    if (textElems.length === 0) {
      Array.from(item.querySelectorAll('*')).forEach(el => {
        if (!el.closest('.image')) {
          if (/^H[1-6]|P|UL|OL|LI|A|SPAN|DIV$/i.test(el.tagName) && el.textContent.trim().length > 0) {
            textElems.push(el);
          }
        }
      });
    }
    // Defensive: fallback to any non-image textContent if above fails
    if (textElems.length === 0) {
      const clone = item.cloneNode(true);
      const imageDiv = clone.querySelector('.image');
      if (imageDiv) imageDiv.remove();
      const fallback = clone.textContent.trim();
      if (fallback) textElems.push(document.createTextNode(fallback));
    }
    // Final second cell
    const secondCell = textElems.length > 0 ? textElems : '';

    rows.push([firstCell, secondCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
