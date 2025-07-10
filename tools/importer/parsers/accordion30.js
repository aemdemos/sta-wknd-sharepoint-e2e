/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion component within the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Build table rows
  const rows = [];
  rows.push(['Accordion']); // Header row with block name, per requirements

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // TITLE CELL (reference the span if present)
    let titleCell = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      // Fallback: use header text
      const header = item.querySelector('.cmp-accordion__header');
      titleCell = header ? header.textContent.trim() : '';
    }

    // CONTENT CELL: get the main content inside the .cmp-accordion__panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Try to get the innermost .cmp-container, otherwise fallback to panel
      let contentContainer = panel.querySelector('.cmp-container') || panel;
      // If there are .cmp-text blocks, use them all (as array)
      const textBlocks = Array.from(contentContainer.querySelectorAll('.cmp-text'));
      if (textBlocks.length > 0) {
        contentCell = textBlocks;
      } else {
        // Fallback: use all block-level elements in the container
        const blockLevel = Array.from(contentContainer.children).filter(el => el.nodeType === 1);
        if (blockLevel.length > 0) {
          contentCell = blockLevel;
        } else {
          contentCell = contentContainer.textContent.trim();
        }
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace accordion with table
  accordion.replaceWith(table);
}
