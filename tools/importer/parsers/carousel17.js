/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    return item.querySelector('img');
  }

  // Helper to extract the text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    const textParts = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textParts.push(heading.cloneNode(true));
    item.querySelectorAll('p').forEach(p => {
      textParts.push(p.cloneNode(true));
    });
    item.querySelectorAll('a').forEach(a => {
      if (!a.closest('p')) textParts.push(a.cloneNode(true));
    });
    if (textParts.length === 0) return null;
    if (textParts.length === 1) return textParts[0];
    return textParts;
  }

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Build the table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Carousel (carousel17)'];
  rows.push(headerRow);

  items.forEach((item) => {
    const img = getImageFromItem(item);
    if (!img) return;
    const textContent = getTextContentFromItem(item);
    // Only push two columns if there is text content, otherwise just the image
    if (textContent) {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
