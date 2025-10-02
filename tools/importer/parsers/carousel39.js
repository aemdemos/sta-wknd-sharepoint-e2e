/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  const headerRow = ['Carousel (carousel39)'];
  rows.push(headerRow);

  // For each slide, extract image and all text content (second cell only if present)
  items.forEach(item => {
    // Find the first <img> inside this item
    const img = item.querySelector('img');
    if (!img) return; // skip if no image
    // Collect all possible text content in the slide
    const textNodes = item.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a');
    const textCell = [];
    textNodes.forEach(node => {
      textCell.push(node.cloneNode(true));
    });
    // Only add the second cell if there's text content, otherwise omit it
    if (textCell.length) {
      rows.push([
        img.cloneNode(true),
        textCell
      ]);
    } else {
      rows.push([
        img.cloneNode(true)
      ]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
