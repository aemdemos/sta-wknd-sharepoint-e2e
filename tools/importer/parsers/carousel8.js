/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a carousel item
  function getTextContentFromItem(item) {
    let textParts = [];
    // Look for heading elements
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      textParts.push(h);
    }
    // Look for paragraphs
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      textParts.push(para);
    });
    // If no heading or paragraph, look for any other text nodes
    if (textParts.length === 0) {
      Array.from(item.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textParts.push(node.textContent.trim());
        }
      });
    }
    // If nothing found, return null
    if (textParts.length === 0) return null;
    if (textParts.length === 1) return textParts[0];
    return textParts;
  }

  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel8)'];
  rows.push(headerRow);

  // For each slide, extract image and text content
  items.forEach((item) => {
    const img = getImageFromItem(item);
    if (!img) return;
    const textContent = getTextContentFromItem(item);
    // Only include the second cell if there is text content
    if (textContent) {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
