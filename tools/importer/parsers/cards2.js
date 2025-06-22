/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list UL containing all cards
  const cardsList = element.querySelector('.image-list.list .cmp-image-list');
  if (!cardsList) return;

  // Prepare header as in the markdown example
  const rows = [['Cards (cards2)']];

  // Go through each card in the list
  cardsList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // --- IMAGE CELL ---
    const img = li.querySelector('img');
    // --- TEXT CELL ---
    const textParts = [];
    // Title (strong)
    const title = li.querySelector('.cmp-image-list__item-title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textParts.push(strong);
      textParts.push(document.createElement('br'));
    }
    // Description (always include, even if not present, to match example)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      textParts.push(document.createTextNode(desc.textContent.trim()));
    }
    // Add a card row if has image and any text
    if (img && textParts.length) {
      rows.push([img, textParts]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
