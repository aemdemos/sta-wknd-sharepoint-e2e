/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];
  // Get all cards
  const cards = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cards.forEach(card => {
    // Image: the first <img> inside the card
    const img = card.querySelector('img');
    // Text content cell
    const cellContent = [];
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Title as <strong>
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        cellContent.push(strong);
      }
    }
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Description as <p>
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      cellContent.push(p);
    }
    rows.push([img, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}