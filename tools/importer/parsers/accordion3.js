/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the provided element
  // Build a table: first row is header, then each row is [title, content]
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Find the accordion element (may be nested)
  let accordionRoot = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordionRoot) {
    accordionRoot = element.querySelector('.cmp-accordion');
  }
  if (!accordionRoot) return;

  // Find all accordion items
  const items = Array.from(accordionRoot.querySelectorAll('.cmp-accordion__item'));
  items.forEach(item => {
    // Title cell: clickable label for accordion item
    const button = item.querySelector('.cmp-accordion__button');
    let title;
    if (button) {
      // Use the visible title span if available
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan : button;
    } else {
      // fallback if button is missing
      title = document.createElement('span');
      title.textContent = 'Untitled';
    }
    // Content cell: body text, media, or additional elements shown when expanded
    // Panel may contain nested containers or just text blocks
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content;
    if (panel) {
      // If the panel contains just one container, use it
      if (panel.childElementCount === 1) {
        content = panel.firstElementChild;
      } else {
        // Prefer to reference all children, to be resilient to structure
        content = Array.from(panel.children);
      }
    } else {
      content = '';
    }
    rows.push([title, content]);
  });

  // Create table block and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
