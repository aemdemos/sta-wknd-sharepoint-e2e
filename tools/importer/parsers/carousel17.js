/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    element.replaceWith(document.createTextNode(''));
    return;
  }

  // Find all carousel items (slides)
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    const img = item.querySelector('img');
    // Only add a single cell (image) since there is no text content
    if (img) rows.push([img]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
