/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the accordion block
  function findAccordionBlock(root) {
    // Look for the first .accordion or .cmp-accordion in the subtree
    return root.querySelector('.accordion.panelcontainer, .cmp-accordion');
  }

  // Helper to extract accordion items from the block
  function extractAccordionItems(accordion) {
    const items = [];
    // Find all accordion items
    const itemNodes = accordion.querySelectorAll('.cmp-accordion__item');
    itemNodes.forEach((item) => {
      // Title: Find the button with the title span
      const button = item.querySelector('.cmp-accordion__button');
      let titleSpan = button && button.querySelector('.cmp-accordion__title');
      let titleContent;
      if (titleSpan) {
        // Use the span directly
        titleContent = titleSpan;
      } else {
        // Fallback: use button text
        titleContent = document.createElement('span');
        titleContent.textContent = button ? button.textContent.trim() : '';
      }
      // Content: Find the panel
      const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      let contentCell;
      if (panel) {
        // Defensive: If the panel contains a single container, use its children
        const innerContainer = panel.querySelector('.cmp-container');
        if (innerContainer) {
          // Use all direct children of the inner container
          const children = Array.from(innerContainer.children).map((child) => child);
          // If only one child, use it directly
          contentCell = children.length === 1 ? children[0] : children;
        } else {
          // Fallback: use panel's children
          const children = Array.from(panel.children).map((child) => child);
          contentCell = children.length === 1 ? children[0] : children;
        }
      } else {
        // Fallback: empty cell
        contentCell = '';
      }
      items.push([titleContent, contentCell]);
    });
    return items;
  }

  // Find the accordion block within the element
  const accordion = findAccordionBlock(element);
  if (!accordion) {
    // No accordion found, do nothing
    return;
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];
  const accordionItems = extractAccordionItems(accordion);
  rows.push(...accordionItems);

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion block with the table
  accordion.replaceWith(blockTable);
}
