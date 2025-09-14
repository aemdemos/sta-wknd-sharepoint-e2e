/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion root
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the header row as specified
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the .cmp-accordion__title span (text only)
    let titleCell = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan.textContent.trim();
    }

    // Content cell: get the panel content (usually a div with .cmp-accordion__panel)
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Defensive: find the first .cmp-container or .container inside the panel
      // This will grab all content for this accordion item
      const container = panel.querySelector('.cmp-container, .container');
      if (container) {
        contentCell = container;
      } else {
        // fallback: just use the panel itself
        contentCell = panel;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the table
  accordion.replaceWith(table);
}
