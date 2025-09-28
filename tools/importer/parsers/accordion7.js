/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header must match the target block name exactly
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: extract from .cmp-accordion__title inside button
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      }
    }
    // Defensive fallback for missing title
    if (!titleText) {
      titleText = 'Accordion Item';
    }

    // Content cell: extract from panel
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Prefer the cmp-container inside panel if present
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Reference the existing cmp-container element
        contentCell = cmpContainer;
      } else {
        // Reference the panel itself if no cmp-container
        contentCell = panel;
      }
    } else {
      // Defensive: create empty div if no panel
      contentCell = document.createElement('div');
      contentCell.textContent = '';
    }

    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion block with the new table
  accordion.replaceWith(table);
}
