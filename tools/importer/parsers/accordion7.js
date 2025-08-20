/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block in the provided element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items (top-level only)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Extract the title for the accordion row
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        // fallback, use button text
        title = button.textContent.trim();
      }
    }

    // Extract the content for the accordion row
    let content = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Prefer the innermost .cmp-text inside the panel
      const text = panel.querySelector('.cmp-text');
      if (text) {
        content = text;
      } else {
        // fallback, use whole panel if no .cmp-text found
        content = panel;
      }
    }

    // Only add row if both title and content exist
    if (title && content) {
      rows.push([title, content]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion in the DOM with the block table
  accordion.replaceWith(block);
}
