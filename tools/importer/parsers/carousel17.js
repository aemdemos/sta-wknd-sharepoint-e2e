/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a carousel item
  function getTextContentFromItem(item) {
    // Look for heading elements and paragraphs
    const textBlocks = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textBlocks.push(heading.cloneNode(true));
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => textBlocks.push(p.cloneNode(true)));
    // If still empty, try any text node
    if (textBlocks.length === 0) {
      const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (node.parentNode && !['SCRIPT','STYLE'].includes(node.parentNode.nodeName)) {
            if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      });
      let node;
      let text = '';
      while ((node = walker.nextNode())) {
        text += node.textContent.trim() + ' ';
      }
      if (text.trim()) textBlocks.push(text.trim());
    }
    // Only return if there is visible text content
    if (textBlocks.length === 0) return '';
    if (textBlocks.length === 1) return textBlocks[0];
    return textBlocks;
  }

  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  const headerRow = ['Carousel (carousel17)'];
  rows.push(headerRow);

  items.forEach((item) => {
    const img = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    // Always push two columns: image and text (even if empty)
    if (img) {
      rows.push([img, textContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
