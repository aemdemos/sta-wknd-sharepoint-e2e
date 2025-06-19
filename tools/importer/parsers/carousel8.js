/* global WebImporter */
export default function parse(element, { document }) {
  // The block name as header, exactly matching the example
  const headerRow = ['Carousel (carousel8)'];
  const tableRows = [headerRow];

  // Find all carousels in the element
  const carousels = element.querySelectorAll('.cmp-carousel');

  carousels.forEach((carousel) => {
    const content = carousel.querySelector('.cmp-carousel__content');
    if (!content) return;
    // Each item is a slide
    const items = content.querySelectorAll('.cmp-carousel__item');
    items.forEach((item) => {
      // Find the image (mandatory) in the slide
      let img = null;
      const imgContainer = item.querySelector('.image, .cmp-image, [data-cmp-is="image"]');
      if (imgContainer) {
        img = imgContainer.querySelector('img');
      }
      if (!img) {
        img = item.querySelector('img');
      }
      if (!img) return; // Defensive: skip slides without an image

      // Text cell: collect any textual content in the slide, excluding image wrappers
      let textContent = [];
      const children = Array.from(item.children);
      children.forEach((child) => {
        if (
          child === imgContainer ||
          child.classList.contains('image') ||
          child.classList.contains('cmp-image') ||
          child.getAttribute('data-cmp-is') === 'image'
        ) {
          return;
        }
        textContent.push(child);
      });
      // Remove empty textContent
      let row;
      if (textContent.length === 0) {
        // Only image in this slide; make row single cell, matching example
        row = [img];
      } else {
        row = [img, textContent];
      }
      tableRows.push(row);
    });
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
