/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));

  // Prepare table rows
  const rows = [];
  // Header row (block name)
  rows.push(['Accordion (accordion7)']);

  // For each item, extract title and content
  items.forEach((item) => {
    // Title: find the button and its title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = null;
    if (panel) {
      // Defensive: get all children (usually a container with text)
      const panelChildren = Array.from(panel.children);
      // If only one child, use it directly
      if (panelChildren.length === 1) {
        content = panelChildren[0];
      } else if (panelChildren.length > 1) {
        content = panelChildren;
      } else {
        content = panel;
      }
    }
    // Add row: [title, content]
    rows.push([
      title,
      content
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
