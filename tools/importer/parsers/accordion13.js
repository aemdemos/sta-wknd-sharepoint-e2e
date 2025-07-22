/* global WebImporter */
export default function parse(element, { document }) {
  // Find the FAQ accordion container (look for .cmp-accordion)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare rows: header row first
  const rows = [['Accordion']];

  // Select all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: .cmp-accordion__title inside the button
    const button = item.querySelector('.cmp-accordion__button');
    let titleContent;
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Reference the existing span node (do NOT clone)
        titleContent = titleSpan;
      } else {
        // fallback: the button text
        titleContent = document.createTextNode(button.textContent.trim());
      }
    } else {
      titleContent = '';
    }

    // Content cell: .cmp-accordion__panel (can have multiple children)
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Prefer the first .cmp-container inside the panel (usually has .cmp-text)
      const containers = panel.querySelectorAll(':scope > .cmp-container');
      if (containers.length > 0) {
        // If only one, reference it directly, else use array
        contentCell = containers.length === 1 ? containers[0] : Array.from(containers);
      } else {
        // fallback: all immediate children of the panel
        const children = Array.from(panel.childNodes).filter(n => {
          // Ignore empty text nodes
          return n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '';
        });
        contentCell = children.length === 1 ? children[0] : children;
      }
    }
    rows.push([titleContent, contentCell]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion element with the table
  accordion.parentNode.replaceChild(table, accordion);
}
