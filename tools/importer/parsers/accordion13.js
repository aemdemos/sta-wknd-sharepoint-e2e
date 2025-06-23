/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block in the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  // Build the table rows
  const rows = [];
  // Header row - must exactly match the block name
  rows.push(['Accordion']);

  items.forEach((item) => {
    // Title cell: get the .cmp-accordion__title span inside the button
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = null;
    if (button) {
      titleSpan = button.querySelector('.cmp-accordion__title');
    }
    let titleCell = '';
    if (titleSpan) {
      titleCell = titleSpan; // Use the DOM element directly to preserve formatting
    } else if (button) {
      // fallback to button text if span is missing (edge case)
      titleCell = document.createTextNode(button.textContent.trim());
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: get the panel (may contain a container, text, etc.)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // If the panel contains a .cmp-container, use it directly (preserves all content)
      const container = panel.querySelector('.cmp-container');
      if (container) {
        contentCell = container;
      } else {
        // fallback to panel's children (in case .cmp-container is missing)
        if (panel.children.length > 0) {
          contentCell = Array.from(panel.children);
        } else {
          // fallback to text content if panel is empty
          contentCell = document.createTextNode(panel.textContent.trim());
        }
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion with the new table
  accordion.replaceWith(table);
}
