/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  const cells = [];
  // Table header row: block name as specified in the example
  cells.push(['Accordion (accordion13)']);

  // Find all accordion items in original order
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: reference the original button element (contains heading, icon, and accessibility attributes)
    const button = item.querySelector('.cmp-accordion__button');
    const titleCell = button ? button : '';

    // Content cell: reference all original children of the content panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Only include direct children (usually a container div)
      const children = Array.from(panel.children).filter(child => child.textContent.trim() || child.querySelector('*'));
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // If no children, fallback to the panel itself
        contentCell = panel;
      }
    }

    cells.push([titleCell, contentCell]);
  });

  // Replace original element with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
