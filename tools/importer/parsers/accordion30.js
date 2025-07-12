/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  // Build the header row - must EXACTLY match the block name
  const cells = [['Accordion']];
  // For each item, build [title, content] row
  items.forEach((item) => {
    // Title cell
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan;
      } else {
        // fallback to button text
        title = document.createTextNode(button.textContent.trim());
      }
    }
    // Content cell
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Content is typically nested in responsivegrid/container/text
      // We want all meaningful children from inside the panel
      const deepContent = [];
      // Find all .cmp-container descendants (often only one per panel)
      const containers = panel.querySelectorAll('.cmp-container');
      if (containers.length > 0) {
        containers.forEach((container) => {
          // Get all direct children with content (e.g. .text or other blocks)
          Array.from(container.children).forEach((block) => {
            // If the block has a .cmp-text, use that
            const textBlock = block.querySelector('.cmp-text');
            if (textBlock) {
              deepContent.push(textBlock);
            } else {
              // Otherwise, add the block itself
              deepContent.push(block);
            }
          });
        });
      } else {
        // Fallback: if no containers, take all direct children (not scripts/styles)
        Array.from(panel.children).forEach((child) => {
          if (!['SCRIPT', 'STYLE'].includes(child.tagName)) {
            deepContent.push(child);
          }
        });
      }
      if (deepContent.length === 1) {
        content = deepContent[0];
      } else if (deepContent.length > 1) {
        content = deepContent;
      } else {
        // fallback to the panel itself
        content = panel;
      }
    }
    cells.push([title, content]);
  });
  // Create the block table and replace accordion
  const table = WebImporter.DOMUtils.createTable(cells, document);
  accordion.replaceWith(table);
}
