/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll(':scope .accordion, :scope .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell: find the button title text
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = titleSpan ? titleSpan.textContent.trim() : '';
    // Defensive fallback: if no span, try button text
    if (!titleContent) {
      const btn = item.querySelector('.cmp-accordion__button');
      if (btn) titleContent = btn.textContent.trim();
    }
    // Create a strong element for the title (for visual emphasis)
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleContent;

    // Content cell: find the panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell;
    if (panel) {
      // Defensive: get all direct children of the panel (usually a container)
      // We'll reference the whole panel content for resilience
      // If the panel contains a single container, use its children
      const container = panel.querySelector(':scope > .container, :scope > .cmp-container');
      if (container) {
        // Usually the container has a cmp-container inside, then .text, etc.
        // We'll collect all direct children of cmp-container
        const cmpContainer = container.querySelector(':scope > .cmp-container');
        if (cmpContainer) {
          // Get all children (usually .text blocks)
          const contentBlocks = Array.from(cmpContainer.children);
          contentCell = contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks;
        } else {
          // Fallback: use container itself
          contentCell = container;
        }
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // Fallback: empty cell
      contentCell = '';
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
