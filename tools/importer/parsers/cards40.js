/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, matching exactly the example
  const headerRow = ['Cards (cards40)'];
  const cells = [headerRow];
  // Find all cards (li.cmp-image-list__item)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // --- Image Cell ---
    // Always reference the actual <img> element (not clone)
    const img = item.querySelector('img');
    const imageCell = img || '';
    // --- Text Cell ---
    // Title: a.cmp-image-list__item-title-link > span.cmp-image-list__item-title
    const titleSpan = item.querySelector('span.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      // Use <strong> for heading style, referencing the text
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }
    // Description: span.cmp-image-list__item-description
    const descSpan = item.querySelector('span.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent.trim();
    }
    // Compose the text cell: title above description
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    // Reference existing elements only, avoid clones
    cells.push([imageCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
