/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;

  // Find all accordion items
  const items = Array.from(accordionContainer.querySelectorAll('.cmp-accordion__item'));
  if (!items.length) return;

  // Build the header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Title cell: find the button with the title span
    const button = item.querySelector('button.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleText = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content cell: find the panel
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell;
    if (panel) {
      // Defensive: grab all direct children of the panel
      // Usually there's a container > cmp-container > text > cmp-text
      // We'll grab the deepest .cmp-text or fallback to panel's children
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        // Use all children of cmpText
        contentCell = Array.from(cmpText.children);
      } else {
        // Fallback: use all children of panel
        contentCell = Array.from(panel.children);
      }
      // If still empty, fallback to panel itself
      if (!contentCell.length) contentCell = [panel];
    } else {
      contentCell = [''];
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block
  accordionContainer.replaceWith(block);
}
