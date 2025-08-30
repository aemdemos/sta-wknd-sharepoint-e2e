/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Extract all accordion items
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));

  // Header row: single column, exactly as in the markdown example
  const rows = [['Accordion (accordion7)']];

  // Each subsequent row: a single cell, which is an array containing the title and content
  items.forEach((item) => {
    // Get the accordion item title
    let title = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    } else {
      const btn = item.querySelector('button');
      if (btn) title = btn.textContent.trim();
    }

    // Get the accordion item content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        const contentNodes = Array.from(cmpContainer.children);
        if (contentNodes.length === 1) {
          contentCell = contentNodes[0];
        } else if (contentNodes.length > 1) {
          contentCell = contentNodes;
        }
      } else {
        const contentNodes = Array.from(panel.children);
        if (contentNodes.length === 1) {
          contentCell = contentNodes[0];
        } else if (contentNodes.length > 1) {
          contentCell = contentNodes;
        }
      }
    }
    // Each row is a single cell containing an array: [title, content]
    rows.push([[title, contentCell]]);
  });

  // Create the block table (single column structure)
  const block = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(block);
}
