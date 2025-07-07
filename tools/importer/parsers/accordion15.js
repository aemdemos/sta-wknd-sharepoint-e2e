/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Accordion block root in the provided element
  // The main accordion is a .accordion .cmp-accordion inside the main DOM
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Get all items in the accordion
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  const rows = [['Accordion']]; // Header exactly as specified

  items.forEach(item => {
    // Title cell: find the title text inside button > span.cmp-accordion__title
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleSpan) {
      // Use a <div> to preserve proper HTML, and reference the text node for semantic meaning
      const div = document.createElement('div');
      div.innerHTML = titleSpan.innerHTML; // preserve any formatting, if present
      titleCell = div;
    } else {
      // fallback in case of missing title
      titleCell = '';
    }

    // Content cell: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // The actual content is inside a nested grid/container
      // We'll collect all text/image/etc blocks inside the panel
      const blocks = [];
      // All .cmp-container inside panel (may contain .text, etc)
      const containers = panel.querySelectorAll('.cmp-container');
      if (containers.length > 0) {
        containers.forEach(cont => {
          // For each direct child of container that is a content block
          // Typically .text or .cmp-text, but grab all for flexibility
          Array.from(cont.children).forEach(child => {
            blocks.push(child);
          });
        });
      } else {
        // Sometimes, just use all children of the panel
        Array.from(panel.children).forEach(child => {
          blocks.push(child);
        });
      }
      // If no blocks found, fallback to using the panel itself
      if (blocks.length === 0) {
        contentCell = panel;
      } else if (blocks.length === 1) {
        contentCell = blocks[0];
      } else {
        // Wrap in a div to preserve order and allow for multiple nodes
        const containerDiv = document.createElement('div');
        blocks.forEach(b => containerDiv.appendChild(b));
        contentCell = containerDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
