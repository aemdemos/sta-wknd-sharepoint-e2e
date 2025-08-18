/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];

  // Get the grid container holding all children in order
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // We'll keep a buffer to capture consecutive context/intros before each card group.
  let contextBuffer = [];

  // Iterate in DOM order
  Array.from(grid.children).forEach(child => {
    // Context rows: .title or .text blocks (group headings, intros, etc.)
    if (child.classList.contains('title')) {
      const titleBlock = child.querySelector('.cmp-title');
      if (titleBlock) {
        // If we already have context in the buffer, flush it first
        if (contextBuffer.length) {
          contextBuffer.forEach(ctx => cells.push([ctx]));
          contextBuffer = [];
        }
        contextBuffer.push(titleBlock);
      }
    }
    if (child.classList.contains('text')) {
      const textBlock = child.querySelector('.cmp-text');
      if (textBlock) {
        // If we already have context in the buffer, flush it first
        if (contextBuffer.length) {
          contextBuffer.forEach(ctx => cells.push([ctx]));
          contextBuffer = [];
        }
        contextBuffer.push(textBlock);
      }
    }
    // Card blocks (Contributor/Guide card section)
    if (child.classList.contains('experiencefragment')) {
      // If any context buffer exists, insert as its own rows before the first card of this group
      if (contextBuffer.length) {
        contextBuffer.forEach(ctx => cells.push([ctx]));
        contextBuffer = [];
      }
      // Card Image
      const image = child.querySelector('.cmp-image__image');
      // Card Text (name, subtitle)
      const textElements = [];
      child.querySelectorAll('.cmp-title__text').forEach(el => textElements.push(el));
      // Social Links
      const socialLinks = Array.from(child.querySelectorAll('a.cmp-button'));
      if (socialLinks.length > 0) {
        const linksDiv = document.createElement('div');
        socialLinks.forEach(link => linksDiv.appendChild(link));
        textElements.push(linksDiv);
      }
      cells.push([
        image,
        textElements
      ]);
    }
  });

  // Flush any remaining context rows if they exist (e.g. trailing intros, rare)
  if (contextBuffer.length) {
    contextBuffer.forEach(ctx => cells.push([ctx]));
  }

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
