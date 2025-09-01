/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block: look for .accordion .cmp-accordion
  const accordionContainer = element.querySelector('.accordion');
  if (!accordionContainer) return;
  const accordion = accordionContainer.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Build header row as in the spec
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Extract the accordion title (text)
    let title = '';
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = btn.textContent.trim();
      }
    }
    // Title cell is just the string
    const titleCell = title;

    // Extract the content cell (panel)
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // The direct children of panel are usually containers; include all for resilience
      // We'll collect all non-empty element children
      const contentNodes = Array.from(panel.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      // If only one, reference it directly; if multiple, as array
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        // fallback - empty panel
        contentCell = '';
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
