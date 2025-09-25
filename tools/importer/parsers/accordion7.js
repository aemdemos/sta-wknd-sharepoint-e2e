/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row: exactly one column with block name
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button text (the clickable label)
    const button = item.querySelector('.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // Use a <strong> for the title for semantic clarity
    const titleElem = document.createElement('strong');
    titleElem.textContent = titleText;

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentElem = document.createElement('div');
    if (panel) {
      // Defensive: find the deepest .cmp-text or just use the panel
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        Array.from(textBlock.childNodes).forEach((node) => {
          // Remove empty <h3> or <p> nodes
          if (
            (node.nodeType === 1 &&
              ((node.tagName === 'H3' || node.tagName === 'P') && !node.textContent.trim()))
          ) {
            return;
          }
          contentElem.appendChild(node.cloneNode(true));
        });
      } else {
        Array.from(panel.childNodes).forEach((node) => {
          if (
            (node.nodeType === 1 &&
              ((node.tagName === 'H3' || node.tagName === 'P') && !node.textContent.trim()))
          ) {
            return;
          }
          contentElem.appendChild(node.cloneNode(true));
        });
      }
    }
    rows.push([titleElem, contentElem]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header row to have colspan=2 for valid HTML table structure
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
