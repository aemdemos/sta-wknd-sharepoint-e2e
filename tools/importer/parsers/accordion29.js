/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the FAQ accordion within the provided element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Header row as specified in the table structure
  const headerRow = ['Accordion'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // TITLE CELL: Use the actual span element for semantic preservation
    let titleCell;
    const button = item.querySelector('.cmp-accordion__button');
    const span = button && button.querySelector('.cmp-accordion__title');
    if (span) {
      titleCell = span;
    } else if (button) {
      // Fallback: use button text
      titleCell = button.textContent.trim();
    } else {
      titleCell = '';
    }

    // CONTENT CELL: Use the panel's full content container
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // The content is typically wrapped inside deeply nested containers, but we want to preserve all content inside .cmp-accordion__panel
      // Get all child nodes (elements and text nodes)
      const nodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) return true;
        return false;
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      } else {
        contentCell = '';
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the accordion table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
