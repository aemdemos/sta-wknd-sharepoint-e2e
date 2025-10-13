/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;

  // Prepare the header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Select all accordion items
  const items = Array.from(accordionContainer.querySelectorAll('.cmp-accordion__item'));
  if (!items.length) return;

  // For each accordion item, extract title and content
  items.forEach(item => {
    // Title: find the button and span with title
    const button = item.querySelector('button.cmp-accordion__button');
    let titleSpan = button && button.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan.textContent.trim() : '';

    // Content: find the panel
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = null;
    if (panel) {
      // Defensive: grab all direct children of panel (usually one container)
      // We'll grab the first .cmp-container inside panel, or fallback to panel itself
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentCell = cmpContainer;
      } else {
        contentCell = panel;
      }
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion block
  accordionContainer.replaceWith(block);
}
