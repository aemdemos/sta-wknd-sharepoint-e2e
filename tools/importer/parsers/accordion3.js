/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the provided section
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Compose the table header exactly as instructed
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the title content as element or text
    let titleContent = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use the span itself to preserve markup
        titleContent = titleSpan;
      } else {
        // Fallback: use button text
        titleContent = document.createTextNode(button.textContent.trim());
      }
    }

    // Content cell: collect all meaningful children from the panel
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // The AEM FAQ pattern is: panel > .container > .cmp-container > .text > .cmp-text
      // We'll gather all .cmp-container children
      const containers = panel.querySelectorAll('.cmp-container');
      const elements = [];
      containers.forEach(cont => {
        // For resilience, use all child nodes (not just .text)
        Array.from(cont.children).forEach(child => {
          elements.push(child);
        });
      });
      // If nothing found, fallback to all panel children
      if (elements.length > 0) {
        contentCell = elements;
      } else {
        // If no container, fallback to all panel children
        contentCell = Array.from(panel.childNodes).filter(n => {
          // Filter out whitespace-only text nodes
          return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
        });
      }
    }

    rows.push([titleContent, contentCell]);
  });

  // Create table and replace the original accordion element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
