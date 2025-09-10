/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title cell: get the visible title text (span.cmp-accordion__title)
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan.cloneNode(true) : document.createTextNode('');

    // Content cell: get the panel content (div[data-cmp-hook-accordion="panel"])
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find the first .cmp-container inside the panel
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // If only one child, use it directly, else use all children
        if (cmpContainer.children.length === 1) {
          contentCell = cmpContainer.children[0].cloneNode(true);
        } else {
          contentCell = Array.from(cmpContainer.children).map(child => child.cloneNode(true));
        }
      } else {
        // No cmp-container, use all children of panel
        if (panel.children.length === 1) {
          contentCell = panel.children[0].cloneNode(true);
        } else {
          contentCell = Array.from(panel.children).map(child => child.cloneNode(true));
        }
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
