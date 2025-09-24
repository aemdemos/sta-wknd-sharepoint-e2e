/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  // Defensive: look for .accordion .cmp-accordion inside the element
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;

  // Block header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordionContainer.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title: find the .cmp-accordion__title span inside the button
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use the span element directly for formatting
        title = titleSpan.cloneNode(true);
      } else {
        // fallback: use button text
        title = document.createTextNode(button.textContent.trim());
      }
    }

    // Content: find the .cmp-accordion__panel
    let content = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Defensive: get all direct children of the panel (skip aria-hidden etc)
      // Usually it's a .container > .cmp-container > .text > .cmp-text
      // We'll collect all .cmp-text blocks inside
      const texts = Array.from(panel.querySelectorAll('.cmp-text'));
      if (texts.length > 0) {
        // If multiple text blocks, include all
        content = texts.map((t) => t);
      } else {
        // fallback: use innerHTML as a div
        const div = document.createElement('div');
        div.innerHTML = panel.innerHTML;
        content = div;
      }
    }

    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
