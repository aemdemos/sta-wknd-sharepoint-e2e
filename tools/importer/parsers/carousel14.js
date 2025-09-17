/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Always use the required header row
  const headerRow = ['Carousel (carousel14)'];
  const rows = [headerRow];

  // Find all carousels in the block
  const carousels = Array.from(element.querySelectorAll('div.cmp-carousel'));

  carousels.forEach((carousel) => {
    const content = carousel.querySelector('.cmp-carousel__content');
    if (!content) return;
    const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
    items.forEach((item) => {
      // IMAGE CELL: find the image inside the slide
      const img = item.querySelector('.image img.cmp-image__image');
      if (!img) return;
      // TEXT CELL: extract all text content except the image
      const slideChildren = Array.from(item.children);
      const textElements = [];
      slideChildren.forEach((child) => {
        // Skip the image container
        if (child.classList.contains('image')) return;
        // Collect all text nodes and elements
        if (child.textContent.trim() || child.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').length) {
          textElements.push(child.cloneNode(true));
        }
      });
      // Only add the second cell if there is actual text content
      if (textElements.length) {
        rows.push([img.cloneNode(true), textElements]);
      } else {
        rows.push([img.cloneNode(true)]);
      }
    });
  });

  // Always create the table (even if only header row)
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
