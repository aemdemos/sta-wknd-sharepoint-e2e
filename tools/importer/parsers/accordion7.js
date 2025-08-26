/* global WebImporter */

export default function parse(element, { document }) {
  // Find the accordion block in the HTML
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Header row: BLOCK NAME
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Each accordion item = a row, 2 columns: [Title, Content]
  const accordionItems = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  accordionItems.forEach((item) => {
    // Title cell: get the .cmp-accordion__title span, preserve formatting as in the original HTML
    const titleSpan = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = '';
    if (titleSpan) {
      // Use a <p> for block table consistency, but reference the span for formatting
      const titleP = document.createElement('p');
      // Use .innerHTML to preserve any markup
      titleP.innerHTML = titleSpan.innerHTML;
      titleCell = titleP;
    }

    // Content cell: get the contents of the accordion panel
    // .cmp-accordion__panel > .container > .cmp-container > .text (usually)
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Look for a .cmp-container inside the panel
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Reference the whole cmp-container
        contentCell = cmpContainer;
      } else {
        // If not present, fallback to the direct child of panel
        if (panel.children.length) {
          contentCell = Array.from(panel.children);
        } else {
          // If panel is empty, fallback to an empty string
          contentCell = '';
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Construct block table and replace accordion
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
