/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('img');
    return img || '';
  }

  // Helper to extract text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    // Try to find any text content inside the carousel item
    // Look for headings, paragraphs, and links
    const textParts = [];
    // Heading (h1-h4)
    const heading = item.querySelector('h1, h2, h3, h4');
    if (heading) {
      textParts.push(heading.cloneNode(true));
    }
    // Paragraphs
    item.querySelectorAll('p').forEach(p => {
      textParts.push(p.cloneNode(true));
    });
    // Links (if not already included)
    item.querySelectorAll('a').forEach(a => {
      if (!a.closest('p')) {
        textParts.push(a.cloneNode(true));
      }
    });
    // If nothing found, try to get any direct text nodes
    if (textParts.length === 0) {
      Array.from(item.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textParts.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
    if (textParts.length === 0) return '';
    if (textParts.length === 1) return textParts[0];
    const wrapper = document.createElement('div');
    textParts.forEach(part => wrapper.appendChild(part));
    return wrapper;
  }

  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all direct child carousel items
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per block guidelines
  const headerRow = ['Carousel (carousel33)'];
  rows.push(headerRow);

  // For each carousel item, create a row: always 2 columns after header
  items.forEach((item) => {
    const image = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    rows.push([image, textContent !== '' ? textContent : '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
