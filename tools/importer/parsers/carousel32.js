/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel32) block: header row, each slide = image + all possible text content
  const headerRow = ['Carousel (carousel32)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides (items)
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find image element inside the slide
    let img = item.querySelector('.cmp-image__image');
    if (!img) img = item.querySelector('img');
    let imageCell = img || '';

    // Collect all possible text content (not just heading, paragraph, link)
    // Get all direct children except image wrappers
    const textContainer = item.cloneNode(true);
    // Remove image(s) from clone
    textContainer.querySelectorAll('.image, .cmp-image, img').forEach(e => e.remove());
    // Gather all remaining text content
    let textContent = [];
    // If there's any non-empty text or elements left, push them
    Array.from(textContainer.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.textContent.trim()) {
        textContent.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        textContent.push(node.textContent.trim());
      }
    });

    // Only add a second column if there is actual text content
    if (textContent.length) {
      rows.push([imageCell, textContent]);
    } else {
      rows.push([imageCell]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
