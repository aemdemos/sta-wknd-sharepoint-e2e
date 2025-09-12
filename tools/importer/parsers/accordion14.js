/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare header row
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the text from the button title span
    const button = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell;
    if (button) {
      // Use a <strong> for semantic emphasis (optional)
      const strong = document.createElement('strong');
      strong.textContent = button.textContent.trim();
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
        // Use the container directly for all content
        contentCell = container;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(table);
}
