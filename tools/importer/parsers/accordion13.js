/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  let accordionContainer;
  const containers = element.querySelectorAll('.cmp-container');
  for (const container of containers) {
    if (container.querySelector('.cmp-accordion')) {
      accordionContainer = container.querySelector('.cmp-accordion');
      break;
    }
  }
  if (!accordionContainer) return;

  // Build header row: exactly one column
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordionContainer.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the button title text
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
    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find all .cmp-text descendants and collect their children (not the wrapper divs)
      const textBlocks = panel.querySelectorAll('.cmp-text');
      const contentNodes = [];
      textBlocks.forEach(tb => {
        Array.from(tb.childNodes).forEach(node => {
          // Remove empty heading tags (e.g., <h3>&nbsp;</h3> or <h3> </h3>)
          if (
            node.nodeType === 1 &&
            /^H[1-6]$/.test(node.nodeName) &&
            (!node.textContent || node.textContent.replace(/\u00a0|\s/g, '') === '')
          ) {
            return;
          }
          contentNodes.push(node.cloneNode(true));
        });
      });
      // If nothing found, fallback to panel text
      if (contentNodes.length > 0) {
        contentCell = contentNodes;
      } else {
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([titleText, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
