/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find the main accordion container
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;

  // Find all accordion items
  const items = accordionContainer.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell
    let titleText = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleText = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content cell
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Use all content inside the panel
      const contentDiv = document.createElement('div');
      Array.from(panel.children).forEach(child => contentDiv.appendChild(child.cloneNode(true)));
      contentCell = contentDiv;
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block
  accordionContainer.replaceWith(block);
}
