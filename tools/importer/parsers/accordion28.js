/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block within the section
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  const headerRow = ['Accordion (accordion28)'];
  const rows = [headerRow];

  // Each accordion item becomes a row with 2 columns
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: Use the span.cmp-accordion__title if present, else use button text
    let titleCell;
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      const button = item.querySelector('button');
      titleCell = button ? button.textContent.trim() : '';
    }

    // Content cell: Use the panel element
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      contentCell = panel;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion with the new table
  accordion.replaceWith(table);
}