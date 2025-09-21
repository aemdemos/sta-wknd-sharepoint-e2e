/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block (the one with class 'cmp-accordion')
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the header row as required
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button title text (inside span.cmp-accordion__title)
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleSpan) {
      // Use the span's text content only (no formatting)
      titleCell = titleSpan.textContent.trim();
    } else {
      // Fallback: use the button text
      const btn = item.querySelector('button');
      titleCell = btn ? btn.textContent.trim() : '';
    }

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Prefer .cmp-text blocks inside the panel
      const textBlocks = panel.querySelectorAll('.cmp-text');
      if (textBlocks.length > 0) {
        // If there are multiple text blocks, concatenate their innerHTML
        contentCell = Array.from(textBlocks).map(tb => tb.innerHTML).join('');
      } else {
        // Fallback: use the panel's innerHTML
        contentCell = panel.innerHTML;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the table
  accordion.replaceWith(table);
}
