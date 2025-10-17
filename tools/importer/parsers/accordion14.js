/* global WebImporter */
export default function parse(element, { document }) {
  // Only extract the accordion block as a table with correct structure
  const accordionRoot = element.querySelector('.accordion .cmp-accordion');
  if (!accordionRoot) return;
  const items = accordionRoot.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  // Table rows: header row, then each item as [title, content]
  const rows = [];
  rows.push(['Accordion (accordion14)']);

  items.forEach((item) => {
    // Title cell
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content cell
    const panel = item.querySelector('.cmp-accordion__panel');
    let content = '';
    if (panel) {
      // Use the content container inside the panel
      const container = panel.querySelector('.container, .cmp-container, .text, .cmp-text');
      if (container) {
        content = container.cloneNode(true);
      } else {
        content = panel.cloneNode(true);
      }
    }
    rows.push([title, content]);
  });

  // Replace the original element with the table
  element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
}
