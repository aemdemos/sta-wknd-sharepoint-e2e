/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items (li.cmp-image-list__item)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // --- Image cell ---
    // Find the <img> inside the card
    const img = li.querySelector('img');
    // Defensive: If no image, skip this card
    if (!img) return;

    // --- Text cell ---
    // Title (inside a <span class="cmp-image-list__item-title">)
    let titleEl;
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }
    // Description (inside <span class="cmp-image-list__item-description">)
    let descEl;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }
    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    // Add the row: [image, text]
    rows.push([img, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
