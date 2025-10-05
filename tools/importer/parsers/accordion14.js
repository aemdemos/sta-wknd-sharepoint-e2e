/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  let accordionContainer = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordionContainer) {
    accordionContainer = element.querySelector('.cmp-accordion');
  }
  if (!accordionContainer) return;

  // Find all accordion items
  const items = accordionContainer.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  // Table header
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // For each accordion item, extract title and content
  items.forEach(item => {
    // Title: find the button's title span
    const button = item.querySelector('button.cmp-accordion__button');
    let titleSpan = button ? button.querySelector('.cmp-accordion__title') : null;
    let titleContent = titleSpan ? titleSpan.textContent.trim() : '';
    // Title cell as plain string (no extra element wrappers)
    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // If there's a .cmp-container inside, use its text children
      let cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Collect all .text blocks inside
        const textBlocks = cmpContainer.querySelectorAll('.text');
        if (textBlocks.length) {
          contentCell = Array.from(textBlocks).map(tb => tb.cloneNode(true));
        } else {
          contentCell = [cmpContainer.cloneNode(true)];
        }
      } else {
        contentCell = [panel.cloneNode(true)];
      }
    } else {
      contentCell = [''];
    }
    rows.push([titleContent, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
