/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  // Build the table cells array
  const cells = [];
  // Header row (exact name from block info)
  cells.push(['Accordion (accordion7)']);

  // For each accordion item, extract the title and content
  items.forEach((item) => {
    // Find the title (from the button span)
    let titleContent = '';
    const btn = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    if (btn) {
      // Wrap in <p> for semantic consistency
      const p = document.createElement('p');
      p.innerHTML = btn.innerHTML;
      titleContent = p;
    }

    // Find the content panel
    let contentContent = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Prefer the deepest meaningful content within the panel
      // Look for .cmp-container > .text, but if not found, use all panel children
      const textBlock = panel.querySelector('.cmp-container .text');
      if (textBlock) {
        contentContent = textBlock;
      } else {
        // If panel has block containers, use them; else, just use all panel children
        const blocks = Array.from(panel.children);
        if (blocks.length) {
          contentContent = blocks;
        } else {
          contentContent = panel;
        }
      }
    }

    cells.push([titleContent, contentContent]);
  });

  // Create the table and replace the accordion element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  accordion.replaceWith(table);
}
