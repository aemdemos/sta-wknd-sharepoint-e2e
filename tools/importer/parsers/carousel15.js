/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel slide items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Prepare table rows
  const rows = [];
  // Always use the required block name as header
  const headerRow = ['Carousel (carousel15)'];
  rows.push(headerRow);

  items.forEach((item) => {
    // Each item is a slide
    // Find the image (first cell)
    let imgCell = '';
    const img = item.querySelector('img');
    if (img) {
      imgCell = img;
    } else {
      const imageDiv = item.querySelector('[data-cmp-is="image"]');
      if (imageDiv) {
        imgCell = imageDiv;
      }
    }

    // Find text content (second cell, optional)
    let textCell = '';
    // Look for possible text blocks inside the slide item
    // Exclude image container
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      // Collect all siblings after imageContainer
      let foundImage = false;
      Array.from(item.childNodes).forEach((child) => {
        if (child === imageContainer) {
          foundImage = true;
        } else if (foundImage && child.nodeType === 1) {
          // Only element nodes after image
          textCell += child.outerHTML;
        }
      });
    } else {
      // If no imageContainer, collect all non-image children
      Array.from(item.childNodes).forEach((child) => {
        if (child.nodeType === 1 && !child.querySelector('img')) {
          textCell += child.outerHTML;
        }
      });
    }
    // Always push two columns per row (second cell empty if no text)
    rows.push([imgCell, textCell.trim() || '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
