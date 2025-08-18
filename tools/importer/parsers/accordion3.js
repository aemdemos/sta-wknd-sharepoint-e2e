/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Header row per requirements
  const headerRow = ['Accordion (accordion3)'];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  const rows = [];
  items.forEach((item) => {
    // Title: clickable question
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : '';
    }
    // Content: the panel, which typically contains .cmp-text
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    // Find the first .cmp-text inside the panel (usually the answer)
    const cmpText = panel ? panel.querySelector('.cmp-text') : null;
    // If .cmp-text exists, use that element; else use everything inside panel
    if (cmpText) {
      content = cmpText;
    } else if (panel) {
      // Use all children of the panel (excluding empty whitespace)
      const validNodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        return true;
      });
      if (validNodes.length === 1) {
        content = validNodes[0];
      } else if (validNodes.length > 1) {
        content = validNodes;
      } else {
        content = '';
      }
    }
    rows.push([title, content]);
  });

  // Compose cells for the table: first row is header, then all items
  const cells = [headerRow, ...rows];
  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace accordion with structured block table
  accordion.replaceWith(block);
}
