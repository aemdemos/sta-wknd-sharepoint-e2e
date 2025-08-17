/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary accordion block inside the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Table header row as per spec
  const headerRow = ['Accordion (accordion3)'];
  
  // Accordion items = each .cmp-accordion__item
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));

  const rows = items.map(item => {
    // Title cell: get the .cmp-accordion__title element
    let titleCell = '';
    const button = item.querySelector('button');
    if (button) {
      // Use the .cmp-accordion__title span if available
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleCell = titleSpan;
      } else {
        // fallback: the button's text
        titleCell = document.createTextNode(button.textContent.trim());
      }
    }

    // Content cell: get panel content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // If there's a .cmp-container (the main content block), use that
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentCell = cmpContainer;
      } else {
        // else, all children of panel
        const children = Array.from(panel.children).filter(n => n.nodeType === Node.ELEMENT_NODE);
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // fallback: the entire panel
          contentCell = panel;
        }
      }
    }

    return [titleCell, contentCell];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original accordion block ONLY
  accordion.replaceWith(table);
}
