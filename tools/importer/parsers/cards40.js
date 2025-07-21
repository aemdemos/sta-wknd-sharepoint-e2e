/* global WebImporter */
export default function parse(element, { document }) {
  // Get the list of image cards
  const list = element.querySelector('.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Image: use the <img> element as-is
    const img = li.querySelector('.cmp-image-list__item-image img');
    const imageEl = img || '';

    // Title: use the <span> as a <strong>
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleEl;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }

    // Description: use a <div>
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan && descSpan.textContent.trim().length > 0) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent.trim();
    }

    // If there's a title and description, stack them
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Add the row for this card
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
