/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find the card list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  ul.querySelectorAll('li.cmp-image-list__item').forEach(li => {
    // Image: reference the <img> element directly
    const img = li.querySelector('.cmp-image-list__item-image img');
    let imageEl = null;
    if (img) imageEl = img;

    // Title: use the span, wrap with <strong>
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Description: use content as separate div
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }

    // Put title and desc together as in the example (title bold, then description on new line)
    const textCellContents = [];
    if (titleEl) textCellContents.push(titleEl);
    if (descEl) textCellContents.push(document.createElement('br'), descEl);

    rows.push([imageEl, textCellContents]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
