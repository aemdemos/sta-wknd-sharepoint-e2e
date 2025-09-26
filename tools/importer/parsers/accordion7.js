/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block in the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: find the button title text
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // Defensive fallback
    if (!titleText) {
      titleText = item.getAttribute('data-cmp-data-layer') || 'Accordion Item';
    }

    // Content cell: find the panel content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Defensive: get all direct children for robust parsing
      // If the panel contains a container, use its children
      let panelContent = [];
      // Find all .cmp-container inside panel (usually one)
      const containers = panel.querySelectorAll('.cmp-container');
      if (containers.length) {
        containers.forEach((container) => {
          // For each container, get all direct children
          Array.from(container.children).forEach((child) => {
            panelContent.push(child);
          });
        });
      } else {
        // If no .cmp-container, use all children of panel
        Array.from(panel.children).forEach((child) => {
          panelContent.push(child);
        });
      }
      // If only one element, use it directly
      if (panelContent.length === 1) {
        contentCell = panelContent[0];
      } else if (panelContent.length > 1) {
        contentCell = panelContent;
      } else {
        // fallback to panel itself
        contentCell = panel;
      }
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion block with the new table
  accordion.parentNode.replaceChild(block, accordion);
}
