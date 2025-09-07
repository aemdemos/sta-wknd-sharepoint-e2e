/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the text from the button's title span
    const button = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleText = '';
    if (button) {
      titleText = button.textContent.trim();
    }

    // Content cell: get the panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell;
    if (panel) {
      // Defensive: find the first .cmp-container inside the panel
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Use the entire cmpContainer as the content cell for resilience
        contentCell = cmpContainer;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      contentCell = document.createElement('div');
    }

    rows.push([titleText, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion block with the new table
  accordion.replaceWith(table);
}
