/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main accordion block inside the provided element
  const accordion = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordion) return;

  // Header row as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = button ? button.querySelector('.cmp-accordion__title') : null;
    let titleCell;
    if (titleSpan) {
      // Use the actual span element for resilience
      titleCell = titleSpan;
    } else {
      // Fallback to text content
      titleCell = button ? button.textContent.trim() : '';
    }

    // Content cell: find the panel div
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: grab all direct children of the panel (usually a container)
      // Use the whole panel content for resilience
      // If the panel contains a single container, use its children
      const panelChildren = Array.from(panel.children);
      if (panelChildren.length === 1 && panelChildren[0].classList.contains('container')) {
        // Use all children of the inner container
        const innerContainer = panelChildren[0];
        // Sometimes there are nested containers, so flatten them
        const innerRows = [];
        innerContainer.querySelectorAll(':scope > .cmp-container > *').forEach(child => {
          innerRows.push(child);
        });
        // If there are children, use them as an array
        contentCell = innerRows.length ? innerRows : innerContainer;
      } else {
        // Use all panel children
        contentCell = panelChildren.length ? panelChildren : panel;
      }
    } else {
      // Fallback: empty cell
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block table
  accordion.replaceWith(table);
}
