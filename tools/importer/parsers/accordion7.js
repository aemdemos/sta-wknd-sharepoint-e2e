/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block inside the provided element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Gather all accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > .cmp-accordion__item'));
  const rows = [];
  // Header row (must match exactly)
  rows.push(['Accordion (accordion7)']);

  // For each accordion item
  items.forEach((item) => {
    // The title is inside the button .cmp-accordion__button > .cmp-accordion__title
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // The content is inside .cmp-accordion__panel
    const panel = item.querySelector('.cmp-accordion__panel');
    let content;
    if (panel) {
      // Use the innermost .cmp-container or .container under the panel
      const container = panel.querySelector('.cmp-container, .container');
      if (container) {
        // Reference the container element directly
        content = container;
      } else {
        // Fallback: wrap panel's children in a fragment
        const fragment = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => fragment.appendChild(node));
        content = fragment;
      }
    } else {
      // No panel/content: leave the cell empty
      content = '';
    }
    rows.push([titleText, content]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the new block table
  accordion.replaceWith(block);
}
