/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const accordionContainer = element.querySelector('.accordion, .panelcontainer');
  if (!accordionContainer) return;

  // Find all accordion items
  const items = accordionContainer.querySelectorAll('.cmp-accordion__item');
  if (!items.length) return;

  // Table header as per spec
  const rows = [
    ['Accordion (accordion7)']
  ];

  // For each accordion item, extract the title and content
  items.forEach((item) => {
    // Title: find the button and its title span
    let title = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content: find the panel
    let content = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Only include the actual FAQ content, not container divs
      // Instead of picking only specific tags, clone the panel and remove all container divs, keeping their children
      const clone = panel.cloneNode(true);
      // Remove all container/responsivegrid/cmp-container wrappers but keep their children
      clone.querySelectorAll('.container, .responsivegrid, .cmp-container').forEach((div) => {
        while (div.firstChild) {
          div.parentNode.insertBefore(div.firstChild, div);
        }
        div.parentNode.removeChild(div);
      });
      // Now, get all direct children (should be only content nodes)
      const contentElements = Array.from(clone.childNodes).filter(node => {
        if (node.nodeType === 1) return true; // element
        if (node.nodeType === 3 && node.textContent.trim()) return true; // text
        return false;
      });
      if (contentElements.length === 1) {
        content = contentElements[0];
      } else if (contentElements.length > 1) {
        content = contentElements;
      } else {
        // fallback: use panel text
        content = clone.textContent.trim();
      }
    }

    rows.push([
      title,
      content
    ]);
  });

  // Create the table and replace the original accordion block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordionContainer.replaceWith(table);
}
