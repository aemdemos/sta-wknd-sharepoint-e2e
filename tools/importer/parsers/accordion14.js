/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the table header as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: use the .cmp-accordion__title element directly if available
    let titleCell = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      // Use the actual DOM element from the document, not a clone
      titleCell = titleSpan;
    } else {
      // As fallback, use the button text
      const btn = item.querySelector('.cmp-accordion__button');
      if (btn) {
        titleCell = btn.textContent.trim();
      } else {
        titleCell = '';
      }
    }

    // Content cell: use the actual content container inside the panel
    let contentCell = '';
    const panel = item.querySelector(':scope > .cmp-accordion__panel');
    if (panel) {
      // Try to find a direct .cmp-container in panel
      let contentBlock = panel.querySelector(':scope > .container > .cmp-container');
      if (contentBlock) {
        // Use the cmp-container element directly (not clone)
        contentCell = contentBlock;
      } else {
        // fallback: use the panel itself
        contentCell = panel;
      }
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
