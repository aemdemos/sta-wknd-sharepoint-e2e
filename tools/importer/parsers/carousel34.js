/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const headerRow = ['Carousel (carousel34)'];

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide items
  const slides = Array.from(carouselContent.children).filter((child) => child.classList.contains('cmp-carousel__item'));
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Image cell: find the first <img> in this slide
    let img = slide.querySelector('img');
    let imgCell = img || '';

    // Text cell: collect all direct children that aren't the image wrapper
    let imageWrap = slide.querySelector('.image');
    let textNodes = [];
    Array.from(slide.children).forEach((child) => {
      if (!imageWrap || child !== imageWrap) {
        textNodes.push(child);
      }
    });
    // Also collect any text nodes (not just elements)
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        textNodes.push(document.createTextNode(node.textContent));
      }
    });
    let textCell = '';
    if (textNodes.length > 0) {
      textCell = textNodes;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
