/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll('.cmp-accordion')).find(Boolean);
  if (!accordion) return;

  // Table header row as specified
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: get the title text from the button span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleSpan) {
      // Use a <strong> for semantic emphasis as in the screenshot
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      titleCell = strong;
    } else {
      titleCell = '';
    }

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: find the first .cmp-container inside the panel
      const container = panel.querySelector('.cmp-container');
      if (container) {
        // Use the entire container as the content cell for resilience
        contentCell = container;
      } else {
        // Fallback: use the panel itself
        contentCell = panel;
      }
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
