/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block inside the given element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Create the table header exactly as in the example
  const cells = [['Accordion']];

  // Extract all accordion items (each is a row in the block)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: use the span.cmp-accordion__title if available (reference, not clone)
    let titleEl = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    // Fallback: use button itself if title span is missing
    if (!titleEl) {
      titleEl = item.querySelector('.cmp-accordion__button');
    }

    // Content cell: find the accordion panel
    let contentEl = item.querySelector('[data-cmp-hook-accordion="panel"]');
    // Try to reference the deepest meaningful content block for resilience
    // Prefer .cmp-container > .text > .cmp-text, but fall back appropriately
    if (contentEl) {
      const container = contentEl.querySelector('.cmp-container');
      if (container) {
        // If there's only one child and it's .text with a .cmp-text, use the cmp-text div
        if (
          container.children.length === 1 &&
          container.firstElementChild &&
          container.firstElementChild.classList.contains('text') &&
          container.firstElementChild.querySelector('.cmp-text')
        ) {
          // Reference the .cmp-text node
          const cmpText = container.firstElementChild.querySelector('.cmp-text');
          contentEl = cmpText || container.firstElementChild;
        } else {
          // Otherwise, use the container itself
          contentEl = container;
        }
      }
    }
    // If contentEl is still null, fallback to empty div to avoid breaking table structure
    if (!contentEl) {
      contentEl = document.createElement('div');
    }

    // Add the row to the table, referencing existing elements
    cells.push([
      titleEl,
      contentEl,
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the accordion with the new table
  accordion.replaceWith(table);
}
