/* global WebImporter */
export default function parse(element, { document }) {
  // Block Header
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find all card items (li elements)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // FIRST CELL: Image
    let imageEl = null;
    const imgDiv = li.querySelector('.cmp-image-list__item-image');
    if (imgDiv) {
      imageEl = imgDiv.querySelector('img');
    }
    // If no image found, set as empty string
    if (!imageEl) imageEl = '';

    // SECOND CELL: Title (strong) + Description
    const cellContent = [];
    // Title (from span, wrapped in <strong>)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      cellContent.push(strong);
    }
    // Description (from span)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent.trim();
      cellContent.push(descP);
    }
    // If no title or description, leave cell empty
    if (cellContent.length === 0) cellContent.push('');
    // Add row for this card
    cells.push([imageEl, cellContent]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
