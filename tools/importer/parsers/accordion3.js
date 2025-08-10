/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root (the first .cmp-accordion inside the element)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Compose rows for the block table
  const rows = [];
  // Header row
  rows.push(['Accordion (accordion3)']);

  // All accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: Text inside the button (could contain markup)
    let titleNode = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleNode) {
      // Reference the actual span element from the DOM
      titleCell = titleNode;
    } else {
      titleCell = '';
    }

    // Content cell: The panel content (usually a .cmp-accordion__panel)
    let panel = item.querySelector('.cmp-accordion__panel');
    let panelCell;
    if (panel) {
      // Only reference first-level children (elements) of the panel
      // If there's only one child, use it directly; otherwise, use an array
      const contentNodes = Array.from(panel.children).filter(el => el);
      if (contentNodes.length === 1) {
        panelCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        panelCell = contentNodes;
      } else {
        // If no element children, check for text
        const text = panel.textContent.trim();
        if (text) {
          const span = document.createElement('span');
          span.textContent = text;
          panelCell = span;
        } else {
          panelCell = '';
        }
      }
    } else {
      panelCell = '';
    }

    rows.push([titleCell, panelCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
