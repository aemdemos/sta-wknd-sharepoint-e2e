/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const panelContainer = element.querySelector('.accordion.panelcontainer');
  if (!panelContainer) return;
  const accordion = panelContainer.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the table rows
  const rows = [];
  rows.push(['Accordion']); // Header row matches exactly

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title: get the .cmp-accordion__title span from the button (reference, do not clone)
    let titleEl = item.querySelector('.cmp-accordion__title');
    let titleCell = titleEl || '';

    // Content: find the panel, and include all its child elements (semantics preserved)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Usually: .container > .cmp-container > (one or more .text)
      // We'll collect all .text elements inside the deepest .cmp-container
      let cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // get all direct children except empty whitespace text nodes
        const contentBlocks = Array.from(cmpContainer.children).filter(el => el.nodeType === 1);
        if (contentBlocks.length === 1) {
          contentCell = contentBlocks[0];
        } else if (contentBlocks.length > 1) {
          // sometimes there are multiple .text blocks or other elements
          contentCell = contentBlocks;
        } else {
          // fallback: use all children of panel
          const fallbackBlocks = Array.from(panel.children).filter(el => el.nodeType === 1);
          contentCell = fallbackBlocks.length === 1 ? fallbackBlocks[0] : fallbackBlocks;
        }
      } else {
        // fallback: use all children of panel
        const fallbackBlocks = Array.from(panel.children).filter(el => el.nodeType === 1);
        contentCell = fallbackBlocks.length === 1 ? fallbackBlocks[0] : fallbackBlocks;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion block (panelcontainer) with the table
  panelContainer.replaceWith(table);
}
