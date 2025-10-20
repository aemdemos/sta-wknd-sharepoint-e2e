/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the accordion block
  function findAccordionBlock(el) {
    return el.querySelector('.cmp-accordion');
  }

  // Helper to extract accordion items (title and content)
  function extractAccordionItems(accordionEl) {
    const items = [];
    const itemEls = accordionEl.querySelectorAll('.cmp-accordion__item');
    itemEls.forEach((itemEl) => {
      // Title: Find the button with class 'cmp-accordion__button', then the span with class 'cmp-accordion__title'
      const button = itemEl.querySelector('.cmp-accordion__button');
      let title = '';
      if (button) {
        const titleSpan = button.querySelector('.cmp-accordion__title');
        if (titleSpan) {
          title = titleSpan.textContent.trim();
        } else {
          title = button.textContent.trim();
        }
      }
      // Content: Find the panel
      const panel = itemEl.querySelector('.cmp-accordion__panel');
      let content = null;
      if (panel) {
        // Defensive: If the panel contains a single container, use its children
        const container = panel.querySelector('.cmp-container');
        if (container) {
          // Use all direct children of the container (usually text blocks)
          const contentBlocks = Array.from(container.children).map((child) => child);
          content = contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks;
        } else {
          // Fallback: Use panel's children
          const panelBlocks = Array.from(panel.children).map((child) => child);
          content = panelBlocks.length === 1 ? panelBlocks[0] : panelBlocks;
        }
      }
      items.push([title, content]);
    });
    return items;
  }

  // Find the accordion block in the element
  const accordionEl = findAccordionBlock(element);
  if (!accordionEl) return;

  // Extract accordion items
  const accordionItems = extractAccordionItems(accordionEl);

  // Build table rows
  const headerRow = ['Accordion (accordion7)'];
  const rows = accordionItems.map(([title, content]) => [title, content]);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Replace the original accordion block with the table
  accordionEl.replaceWith(table);
}
