/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const rows = [['Cards (cards21)']];

  // Find all card items
  const cards = element.querySelectorAll('li.cmp-image-list__item');
  cards.forEach(card => {
    // --- Image ---
    // Find the first image (img element)
    let img = null;
    const imgContainer = card.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // --- Text Content ---
    // Title as bold (strong)
    let title = '';
    const titleSpan = card.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent) {
      title = titleSpan.textContent.trim();
    }
    let titleElem = null;
    if (title) {
      titleElem = document.createElement('strong');
      titleElem.textContent = title;
    }
    // Description (below title)
    let descElem = null;
    const descSpan = card.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent) {
      descElem = document.createElement('div');
      descElem.textContent = descSpan.textContent.trim();
    }
    // Compose right cell (title, then description)
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) textCell.push(document.createElement('br'), descElem);
    // No CTA per source structure/example

    // Add table row: [image, textCell]
    rows.push([
      img,
      textCell
    ]);
  });
  // Replace original element with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
