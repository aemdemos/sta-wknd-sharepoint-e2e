/* global WebImporter */
export default function parse(element, { document }) {
  // Start the block table with the required header
  const cells = [['Cards (cards24)']];

  // We'll collect intro/title/text nodes and group the cards by contiguous card sections
  let buffer = [];

  // Get all immediate children of the main container
  const children = Array.from(element.querySelectorAll(':scope > *'));
  
  function flushBuffer() {
    if (buffer.length > 0) {
      // Combine buffered blocks into a single cell/row
      cells.push([buffer.length === 1 ? buffer[0] : buffer.slice()]);
      buffer = [];
    }
  }

  children.forEach(child => {
    // Section/class that is a card (contributor/guide)
    if (child.matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
      flushBuffer();
      // Card row: image | text+cta
      const img = child.querySelector('img');
      const textParts = [];
      child.querySelectorAll('.title').forEach(titleDiv => {
        if (titleDiv && titleDiv.textContent.trim()) textParts.push(titleDiv);
      });
      child.querySelectorAll('.buildingblock').forEach(block => {
        const buttons = Array.from(block.querySelectorAll('a.cmp-button'));
        if (buttons.length > 0) textParts.push(...buttons);
      });
      if (textParts.length === 0) textParts.push(document.createTextNode(''));
      cells.push([img, textParts]);
    } else if (
      // Capture all intro and header blocks: h1/h2 in .title, .text blocks
      (child.classList.contains('title') && child.querySelector('h1, h2')) ||
      child.classList.contains('text')
    ) {
      buffer.push(child);
    }
  });
  flushBuffer();

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
