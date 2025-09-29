/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordion) return;

  // Prepare table rows
  const rows = [
    ['Accordion (accordion29)'],
  ];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the button text
    const titleEl = item.querySelector('.cmp-accordion__title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Content cell: get the panel content (preserve all HTML and references)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Prefer .cmp-container inside the panel, else use panel itself
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Gather all direct children with content (e.g., .text, .image, etc.)
        const blocks = Array.from(cmpContainer.children).filter(child => {
          return (
            child.classList.contains('text') ||
            child.classList.contains('cmp-text') ||
            child.classList.contains('image') ||
            child.classList.contains('cmp-image')
          );
        });
        if (blocks.length === 1) {
          contentCell = blocks[0];
        } else if (blocks.length > 1) {
          // If multiple, wrap in a fragment
          const frag = document.createDocumentFragment();
          blocks.forEach(b => frag.appendChild(b));
          contentCell = frag;
        } else {
          contentCell = cmpContainer;
        }
      } else {
        contentCell = panel;
      }
    }
    rows.push([title, contentCell]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
