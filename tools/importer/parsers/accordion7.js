/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root
  const accordionRoot = element.querySelector('.accordion .cmp-accordion');
  if (!accordionRoot) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordionRoot.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Find the title (inside button > .cmp-accordion__title)
    let titleEl = item.querySelector('.cmp-accordion__title');
    let titleContent = titleEl ? titleEl.textContent.trim() : '';
    // Defensive: fallback to button text if needed
    if (!titleContent) {
      const btn = item.querySelector('button');
      if (btn) titleContent = btn.textContent.trim();
    }
    // Create a <p> for the title cell
    const titleCell = document.createElement('p');
    titleCell.textContent = titleContent;

    // Find the content panel
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // The actual content is often nested inside .container .cmp-container .text .cmp-text
      // We'll grab all direct children of the deepest .cmp-container inside the panel
      const containers = panel.querySelectorAll('.cmp-container');
      let lastContainer = null;
      if (containers.length) {
        lastContainer = containers[containers.length - 1];
      }
      if (lastContainer) {
        // Grab all direct children (usually .text)
        const contentBlocks = Array.from(lastContainer.children);
        // Flatten all .cmp-text children if present
        const contentEls = [];
        contentBlocks.forEach((block) => {
          if (block.classList.contains('text') || block.classList.contains('cmp-text')) {
            // Use all children (e.g., <p>, <h3>, etc.)
            Array.from(block.children).forEach((child) => contentEls.push(child));
          } else {
            contentEls.push(block);
          }
        });
        // Defensive: if nothing found, fallback to panel innerHTML as text
        if (contentEls.length) {
          contentCell = contentEls;
        } else {
          contentCell = panel.textContent.trim();
        }
      } else {
        // Fallback: just use the panel's text
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
