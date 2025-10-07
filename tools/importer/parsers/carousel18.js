/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel18) block parsing
  // Table header row
  const headerRow = ['Carousel (carousel18)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel item elements
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build rows for each slide (image in first cell, always include a second cell for text content, even if empty)
  const rows = items.map((item) => {
    // Find the image element inside the item
    const img = item.querySelector('img');
    // For this HTML, there is no visible text content, so second cell is empty
    return [img, ''];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
