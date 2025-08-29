/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Start rows array with header row from block name
  const rows = [['Accordion (accordion29)']];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: use the .cmp-accordion__title span element directly if available
    let titleCell = '';
    const btn = item.querySelector('button');
    if (btn) {
      // Find the title span within the button
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      titleCell = titleSpan ? titleSpan : btn.textContent.trim();
    }

    // Content cell: get the panel's main content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to get the main container in the panel
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentCell = cmpContainer;
      } else {
        // fallback: put all panel children
        contentCell = Array.from(panel.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion with the table
  accordion.replaceWith(table);
}
