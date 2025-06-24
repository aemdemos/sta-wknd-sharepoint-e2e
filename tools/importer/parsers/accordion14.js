/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is the main accordion element
  if (!element.classList.contains('cmp-accordion')) return;

  // Build the table rows
  const rows = [['Accordion']]; // Header row: block name exactly as required

  // Get all direct accordion items
  const items = element.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Title: from .cmp-accordion__title
    let titleCell = '';
    const button = item.querySelector('.cmp-accordion__button');
    const titleSpan = button ? button.querySelector('.cmp-accordion__title') : null;
    if (titleSpan) {
      titleCell = titleSpan;
    } else if (button) {
      // fallback: button text
      titleCell = document.createTextNode(button.textContent.trim());
    } else {
      titleCell = '';
    }

    // Content: inside .cmp-accordion__panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Use all direct children of the panel that are not <script> (usually a container)
      const children = Array.from(panel.children).filter((el) => el.nodeType === 1 && el.tagName !== 'SCRIPT');
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: if only text
        contentCell = panel.textContent.trim() ? document.createTextNode(panel.textContent.trim()) : '';
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
