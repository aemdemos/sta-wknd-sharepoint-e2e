/* global WebImporter */
export default function parse(element, { document }) {
  // Locate all accordions within the element
  const accordions = element.querySelectorAll('.cmp-accordion');
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    const rows = [];
    // Block header row as in example, matching exactly
    rows.push(['Accordion (accordion3)']);
    // Process each accordion item
    const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
    items.forEach((item) => {
      // TITLE CELL: Find the .cmp-accordion__title span, else fallback to button text
      let titleEl = item.querySelector('.cmp-accordion__title');
      if (!titleEl) {
        // fallback: use button text
        let btn = item.querySelector('button');
        titleEl = btn ? btn : document.createElement('span');
      }

      // CONTENT CELL: Find the panel and use the top-level container (include all children)
      let contentPanel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      let contentCell = [];
      if (contentPanel) {
        // Usually there's one main container with text blocks
        let primaryContainer = contentPanel.querySelector(':scope > .container, :scope > .cmp-container');
        if (primaryContainer) {
          // If cmp-container, take children
          if (primaryContainer.classList.contains('cmp-container')) {
            contentCell = Array.from(primaryContainer.children);
          } else {
            contentCell = [primaryContainer];
          }
        } else {
          // fallback: take panel direct children
          contentCell = Array.from(contentPanel.children);
          // If none, use panel itself
          if (contentCell.length === 0) {
            contentCell = [contentPanel];
          }
        }
      } else {
        contentCell = [''];
      }
      rows.push([titleEl, contentCell]);
    });
    // Create table with rows
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the original accordion element with the table
    accordion.replaceWith(table);
  });
}
