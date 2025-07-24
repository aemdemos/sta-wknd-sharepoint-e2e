/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the provided element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Compose the table rows
  const rows = [ ['Accordion'] ];

  // For each accordion item, extract title and content
  const items = accordion.querySelectorAll('[data-cmp-hook-accordion="item"]');
  items.forEach((item) => {
    // Title cell: reference the <span class="cmp-accordion__title"> inside the button
    let titleEl = item.querySelector('.cmp-accordion__title');
    let titleCell = titleEl || '';
    // Content cell: reference all contents of [data-cmp-hook-accordion="panel"]
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // If the panel contains a single container div, use its children, else all children
      // We reference panel's children directly (not clones)
      if (panel.children.length === 1 && panel.children[0].classList.contains('container')) {
        const container = panel.children[0];
        // If the container also has one .cmp-container, dig into that
        if (container.children.length === 1 && container.children[0].classList.contains('cmp-container')) {
          contentCell = Array.from(container.children[0].children);
        } else {
          contentCell = Array.from(container.children);
        }
      } else {
        contentCell = Array.from(panel.children);
      }
      // If still nothing, fallback to panel
      if (!contentCell || (Array.isArray(contentCell) && contentCell.length === 0)) {
        contentCell = panel;
      }
    }
    rows.push([
      titleCell,
      contentCell
    ]);
  });

  // Create the Accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion in the DOM with the table block
  accordion.replaceWith(block);
}
