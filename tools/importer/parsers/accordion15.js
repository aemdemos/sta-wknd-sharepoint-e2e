/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block - it may be deeply nested in this element.
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Table header row as per instructions and example
  const cells = [
    ['Accordion (accordion15)']
  ];

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the visible text of the accordion item button
    let title = '';
    const btn = item.querySelector('button.cmp-accordion__button');
    if (btn) {
      const span = btn.querySelector('.cmp-accordion__title');
      if (span) {
        title = span.textContent.trim();
      } else {
        title = btn.textContent.trim();
      }
    }
    // Content cell: get the direct panel content
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to reference the main content in the panel
      // The real content is usually deeply nested, but for resilience, reference all panel children
      // We'll append all direct children of the deepest cmp-container (if present), or the panel's own children
      let container = panel.querySelector('.cmp-container');
      if (container) {
        // Get all immediate children and put them in an array
        contentCell = Array.from(container.children);
      } else {
        // Fallback to all direct children of the panel
        contentCell = Array.from(panel.children);
      }
      // If we still don't get any content, fallback to panel itself (shouldn't happen)
      if (!contentCell || contentCell.length === 0) {
        contentCell = [panel];
      }
    } else {
      contentCell = [''];
    }
    // Add this accordion item as one row
    cells.push([
      title,
      contentCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the accordion in the DOM with the block
  accordion.replaceWith(block);
}
