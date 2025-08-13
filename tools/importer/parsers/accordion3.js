/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  const cells = [['Accordion (accordion3)']]; // Header row (exactly as required)
  if (accordion) {
    const items = accordion.querySelectorAll('.cmp-accordion__item');
    items.forEach((item) => {
      // Title cell: get the title span, preserve as-is
      let titleSpan = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
      let titleCell = titleSpan || document.createElement('span');
      if (!titleSpan) {
        // fallback to button's textContent if no span found
        const btn = item.querySelector('.cmp-accordion__button');
        titleCell.textContent = btn ? btn.textContent : '';
      }
      // Content cell: use all children of the panel's cmp-container
      let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      let contentCell = [];
      if (panel) {
        // Defensive: panel may have .container > .cmp-container > .text, or just .container
        let container = panel.querySelector('.container');
        if (container) {
          let cmpContainer = container.querySelector('.cmp-container');
          if (cmpContainer) {
            // Use all direct children (usually .text etc)
            contentCell = Array.from(cmpContainer.children);
          } else {
            // Use all children of container
            contentCell = Array.from(container.children);
          }
        } else {
          // No .container: just use panel's direct children
          contentCell = Array.from(panel.children);
        }
      }
      cells.push([titleCell, contentCell]);
    });
  }
  // Only replace the accordion block, and not the entire element
  if (accordion) {
    accordion.replaceWith(WebImporter.DOMUtils.createTable(cells, document));
  }
}