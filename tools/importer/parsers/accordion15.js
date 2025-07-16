/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion component
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  // Start with the block header as specified
  const rows = [['Accordion']];

  // For each accordion item, extract the title and content properly
  items.forEach(item => {
    // Title: get the span with class 'cmp-accordion__title' (may contain HTML)
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = '';
    if (titleSpan) {
      // Use the span directly
      titleCell = titleSpan;
    }

    // Content: get the corresponding panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Often, real content is inside a .container or .cmp-container within the panel
      // If not, use the panel itself
      const containers = panel.querySelectorAll(':scope > .container, :scope > .cmp-container');
      if (containers.length > 0) {
        // If single, use that node; if multiple, collect all
        contentCell = containers.length === 1 ? containers[0] : Array.from(containers);
      } else {
        // Fallback: grab all direct children that are not empty
        const children = Array.from(panel.children).filter(el => el.textContent.trim().length > 0 || el.querySelector('img'));
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // fallback to the panel itself
          contentCell = panel;
        }
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
