/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordionBlock = element.querySelector('.accordion.panelcontainer');
  if (!accordionBlock) return;
  const cmpAccordion = accordionBlock.querySelector('.cmp-accordion');
  if (!cmpAccordion) return;

  // Build header row: must be exactly one column, but all rows must have two columns
  const rows = [['Accordion (accordion15)', '']];

  // Find all accordion items
  const items = cmpAccordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button text
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
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: get the panel content
    let contentCell = [];
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const innerContainer = panel.querySelector('.cmp-container');
      if (innerContainer) {
        innerContainer.querySelectorAll('.cmp-text').forEach((txt) => {
          Array.from(txt.children).forEach((child) => {
            if (child.textContent.trim() && child.tagName !== 'H3') {
              contentCell.push(child.cloneNode(true));
            }
          });
        });
      } else {
        Array.from(panel.children).forEach((child) => {
          if (child.textContent.trim() && child.tagName !== 'H3') {
            contentCell.push(child.cloneNode(true));
          }
        });
      }
    }
    rows.push([titleEl, contentCell]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
