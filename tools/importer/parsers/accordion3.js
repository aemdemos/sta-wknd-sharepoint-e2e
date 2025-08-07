/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  if (!items.length) return;

  // Prepare the table rows, starting with the required header
  const rows = [['Accordion (accordion3)']];

  // For each accordion item, extract the title (left cell) and content (right cell)
  items.forEach((item) => {
    // Title cell: get the .cmp-accordion__title span
    let titleEl = item.querySelector('.cmp-accordion__title');
    let titleCell = '';
    if (titleEl) {
      // We want to keep formatting, so reference the element (not its textContent).
      // Wrap with a div to preserve any inner HTML.
      const div = document.createElement('div');
      // move all children, not clone, to ensure referencing existing nodes
      while (titleEl.firstChild) {
        div.appendChild(titleEl.firstChild);
      }
      titleCell = div;
    }
    // Content cell: typically in .cmp-accordion__panel
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Try to find .cmp-text blocks inside the panel
      const texts = panel.querySelectorAll('.cmp-text');
      if (texts.length === 1) {
        contentCell = texts[0];
      } else if (texts.length > 1) {
        // If there are multiple text blocks, put all in a fragment
        const frag = document.createDocumentFragment();
        texts.forEach(tb => frag.appendChild(tb));
        contentCell = frag;
      } else {
        // If no .cmp-text, put all panel children (excluding whitespace)
        const frag = document.createDocumentFragment();
        [...panel.childNodes].forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            frag.appendChild(node);
          }
        });
        contentCell = frag;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion with the block table
  accordion.replaceWith(block);
}
