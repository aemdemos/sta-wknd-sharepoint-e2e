/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const accordionRoot = element.querySelector('.accordion .cmp-accordion');
  if (!accordionRoot) return;

  // Get all accordion items
  const items = Array.from(accordionRoot.querySelectorAll(':scope > .cmp-accordion__item'));
  if (!items.length) return;

  // Table header as per block requirements
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Title cell: get the visible title text
    let titleText = '';
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = btn.textContent.trim();
      }
    }
    // Content cell: get the content panel (may contain nested containers/text)
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Defensive: if panel contains a single container, use its children
      const containers = panel.querySelectorAll(':scope > .container, :scope > .cmp-container, :scope > .text, :scope > .cmp-text');
      if (containers.length === 1) {
        // Use all children of the container as content
        const container = containers[0];
        // If the container has only one child, use it directly
        if (container.children.length === 1) {
          contentCell = container.firstElementChild;
        } else {
          contentCell = Array.from(container.children);
        }
      } else if (containers.length > 1) {
        // Multiple containers: flatten all their children
        contentCell = [];
        containers.forEach((c) => {
          contentCell = contentCell.concat(Array.from(c.children));
        });
      } else {
        // Fallback: use all children of the panel
        if (panel.children.length === 1) {
          contentCell = panel.firstElementChild;
        } else {
          contentCell = Array.from(panel.children);
        }
      }
    }
    // Defensive: if contentCell is still empty, fallback to panel innerHTML
    if (!contentCell || (Array.isArray(contentCell) && contentCell.length === 0)) {
      contentCell = panel ? panel.innerHTML : '';
    }
    rows.push([titleText, contentCell]);
  });

  // Create the table and replace the accordion root
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordionRoot.replaceWith(table);
}
