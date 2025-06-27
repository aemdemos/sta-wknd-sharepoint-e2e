/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row exactly as in the spec
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Get the image element (first image in the card)
    const img = item.querySelector('img');
    let imageEl = img || '';

    // Gather Title (strong)
    let titleEl = null;
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }

    // Gather Description (paragraph)
    let descEl = null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose the right cell
    const contentCell = [];
    if (titleEl) contentCell.push(titleEl);
    if (descEl) contentCell.push(descEl);

    rows.push([
      imageEl,
      contentCell.length ? contentCell : ''
    ]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
