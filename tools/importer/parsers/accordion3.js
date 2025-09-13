/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare the table header
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the text from the button title span
    const button = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = '';
    if (button) {
      titleCell = button.textContent.trim();
    }

    // Content cell: get the panel content (may contain containers, text, etc.)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Defensive: if panel has a single container, use that, else use panel
      const container = panel.querySelector(':scope > .container, :scope > .cmp-container');
      if (container) {
        contentCell = container;
      } else {
        contentCell = panel;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion block with the new table
  accordion.replaceWith(table);
}
