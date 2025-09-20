/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Always use the required header row (EXACTLY one column)
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the text from the button's span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = '';
    if (titleSpan) {
      titleCell = titleSpan.textContent.trim();
    } else {
      // fallback: try button text
      const button = item.querySelector('button');
      titleCell = button ? button.textContent.trim() : '';
    }

    // Content cell: get the panel's content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Only extract the actual visible content (e.g. <p>, <ul>, <ol>, <img>, etc), not wrappers
      // We'll collect all block-level elements that are direct or indirect children of the panel
      const contentNodes = [];
      panel.querySelectorAll('.cmp-text, p, ul, ol, img, h1, h2, h3, h4, h5, h6, table, blockquote, pre').forEach((el) => {
        // Only add if it's not a wrapper (e.g. .cmp-text) but the actual content node
        if (el.matches('p, ul, ol, img, h1, h2, h3, h4, h5, h6, table, blockquote, pre')) {
          contentNodes.push(el);
        } else {
          // If it's a .cmp-text, add its children
          Array.from(el.children).forEach(child => contentNodes.push(child));
        }
      });
      // If nothing found, fallback to all children
      if (contentNodes.length === 0) {
        Array.from(panel.children).forEach(child => contentNodes.push(child));
      }
      contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
