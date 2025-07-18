/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root (.cmp-accordion)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  const rows = [];
  // Header row exactly as specified
  rows.push(['Accordion']);

  // For each accordion item, add its title and content
  items.forEach((item) => {
    // Title: pull the button span text, keep semantic heading level if present
    const button = item.querySelector('button.cmp-accordion__button');
    let titleCell;
    if (button) {
      const titleText = button.querySelector('.cmp-accordion__title');
      // Create a heading element if possible, or just use a span
      const header = document.createElement('h3');
      header.textContent = titleText ? titleText.textContent : button.textContent;
      titleCell = header;
    } else {
      titleCell = document.createTextNode('');
    }

    // Content: the panel div, but only the content inside
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = document.createTextNode('');
    if (panel) {
      // Look for cmp-container class inside panel (the content root)
      let contentRoot;
      // The content is typically in: panel > container > cmp-container
      const firstContainer = panel.querySelector(':scope > .container');
      if (firstContainer) {
        const cmpContainer = firstContainer.querySelector(':scope > .cmp-container');
        if (cmpContainer) {
          // Only reference the cmp-container element, not its HTML string
          contentRoot = cmpContainer;
        } else {
          contentRoot = firstContainer;
        }
      } else {
        contentRoot = panel;
      }
      contentCell = contentRoot;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace accordion element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
