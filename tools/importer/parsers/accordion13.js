/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll('.accordion, .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button text (the clickable label)
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = titleSpan ? titleSpan.textContent.trim() : '';
    // Defensive fallback: if no span, try button text
    if (!titleContent) {
      const button = item.querySelector('.cmp-accordion__button');
      if (button) titleContent = button.textContent.trim();
    }
    // Create a strong element for the title for better semantics
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleContent;

    // Content cell: grab the panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Defensive: find the first container inside the panel
      const container = panel.querySelector('.cmp-container');
      if (container) {
        // Grab all direct children of the container (usually just one .text)
        const children = Array.from(container.children);
        // If only one child, use it directly; if multiple, use all
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // Fallback: use container itself
          contentCell = container;
        }
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    }
    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
