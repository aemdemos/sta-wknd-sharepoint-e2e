/* global WebImporter */
export default function parse(element, { document }) {
  // Locate all cards: each li.cmp-image-list__item is a card
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Block header row as per example
  const rows = [['Cards (cards21)']];

  items.forEach((li) => {
    // IMAGE CELL: reference the <img> if possible
    let img = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        img = imageDiv.querySelector('img');
      }
    }

    // TEXT CELL: title (strong), line break, then description
    const textParts = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textParts.push(strong);
        textParts.push(document.createElement('br'));
      }
    }
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      textParts.push(document.createTextNode(descSpan.textContent.trim()));
    }

    rows.push([
      img,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
