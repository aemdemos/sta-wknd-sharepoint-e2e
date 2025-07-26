/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Header row as required by block definition
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell
    let titleCell;
    const button = item.querySelector('.cmp-accordion__button');
    const titleSpan = button && button.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      // Retain all markup and directly reference the span
      titleCell = titleSpan;
    } else {
      // Fallback if no title
      titleCell = document.createElement('span');
    }

    // Content cell
    let contentCell;
    // Find the panel for this accordion item
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Typically, there is a single container inside, but we want to be robust
      if (panel.children.length === 1) {
        contentCell = panel.children[0]; // direct reference
      } else if (panel.children.length > 1) {
        // If multiple direct children, create a DocumentFragment to preserve all
        const frag = document.createDocumentFragment();
        Array.from(panel.children).forEach(child => frag.appendChild(child));
        contentCell = frag;
      } else {
        contentCell = document.createElement('div'); // empty fallback
      }
    } else {
      contentCell = document.createElement('div'); // empty fallback
    }

    rows.push([titleCell, contentCell]);
  });

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion in the DOM (not the whole element, just the accordion block)
  accordion.replaceWith(block);
}
