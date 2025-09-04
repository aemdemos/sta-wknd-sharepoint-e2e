/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare the header row as required
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button text (the clickable title)
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = titleSpan ? titleSpan.textContent.trim() : '';
    // Defensive fallback: if no title, use empty string
    if (!titleContent) titleContent = '';

    // Content cell: get the panel content
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentCell;
    if (panel) {
      // Defensive: find the first container inside the panel
      const container = panel.querySelector('.cmp-container');
      if (container) {
        // Use the entire container as the content cell
        contentCell = container;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // Fallback: empty cell
      contentCell = document.createElement('div');
    }

    // Add the row: [title, content]
    rows.push([titleContent, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block
  accordion.replaceWith(block);
}
