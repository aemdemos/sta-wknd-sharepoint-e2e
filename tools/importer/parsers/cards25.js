/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Defensive: Find all immediate <li> children (cards)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find image (first cell)
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: If not found, fallback to any <img> inside
    if (!imgEl) {
      imgEl = li.querySelector('img');
    }

    // Find title and wrap in <strong> (second cell)
    let titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleEl;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Find description (second cell)
    let descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }

    // Compose second cell: title (strong) above description (div)
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Add row: [image, text]
    rows.push([imgEl, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
