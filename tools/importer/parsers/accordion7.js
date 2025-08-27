/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // All accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Get the title element as an existing reference (span inside button)
    let titleEl = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      titleEl = button.querySelector('.cmp-accordion__title');
      // Fallback: use the button itself if the span is not found
      if (!titleEl) titleEl = button;
    }

    // Get the corresponding content panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Usually panel > .container > .cmp-container > .text (but can contain more)
      // We'll reference all meaningful children inside the panel for flexibility
      const contentBlocks = Array.from(panel.children).filter(child => {
        // Exclude empty text nodes and hidden elements (unlikely here, but for resilience)
        if (child.nodeType === Node.ELEMENT_NODE) return true;
        return false;
      });
      // If there are no element children, fallback to all childNodes (covers possible loose text nodes)
      if (contentBlocks.length === 0) {
        const allNodes = Array.from(panel.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '');
        if (allNodes.length === 1) {
          contentCell = allNodes[0];
        } else {
          contentCell = allNodes;
        }
      } else if (contentBlocks.length === 1) {
        contentCell = contentBlocks[0];
      } else {
        contentCell = contentBlocks;
      }
    } else {
      contentCell = '';
    }
    rows.push([
      titleEl,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
