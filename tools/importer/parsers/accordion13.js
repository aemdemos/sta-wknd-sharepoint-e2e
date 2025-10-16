/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: Find the accordion container
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: Find the button and its title span
    const button = item.querySelector('button.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleText = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content cell: Find the panel and its inner content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentEls = [];
    if (panel) {
      // Defensive: grab all direct children of the panel (usually one container)
      const panelContainers = Array.from(panel.children);
      panelContainers.forEach((container) => {
        // Find all text blocks inside the panel
        const textBlocks = container.querySelectorAll('.cmp-text');
        if (textBlocks.length) {
          textBlocks.forEach((tb) => contentEls.push(tb));
        } else {
          // If no .cmp-text, just add the container itself
          contentEls.push(container);
        }
      });
    }
    if (contentEls.length === 0) {
      // fallback: add empty paragraph
      const emptyP = document.createElement('p');
      contentEls = [emptyP];
    }
    rows.push([titleText, contentEls]);
  });

  // Create table and replace original accordion element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
