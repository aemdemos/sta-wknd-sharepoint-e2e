/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Compose table rows
  const rows = [];
  // Block header row (must match exactly the example)
  rows.push(['Accordion (accordion14)']);
  
  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the span with cmp-accordion__title (prefer existing element)
    let titleCell = null;
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleCell = titleSpan;
      } else {
        // fallback - use the button itself
        titleCell = btn;
      }
    }
    // Content cell: get the direct panel (use original child elements)
    let contentCell = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Instead of cloning, reference all children as an array
      const panelChildren = Array.from(panel.childNodes).filter(n => {
        // filter out whitespace text
        return n.nodeType !== Node.TEXT_NODE || n.textContent.trim().length > 0;
      });
      if (panelChildren.length === 1) {
        contentCell = panelChildren[0];
      } else if (panelChildren.length > 1) {
        contentCell = panelChildren;
      } else {
        // panel is empty
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace accordion with table
  accordion.replaceWith(table);
}
