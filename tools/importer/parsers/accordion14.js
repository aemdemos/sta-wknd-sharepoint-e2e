/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: find the button text (span.cmp-accordion__title)
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan.textContent.trim() : '';

    // Content cell: find the panel
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: get all direct children (usually a container)
      // We want the full content block inside the panel
      // If there's only one child, use it directly
      const children = Array.from(panel.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: use panel itself
        contentCell = panel;
      }
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
