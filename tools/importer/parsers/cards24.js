/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Defensive: find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    // Each card
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image element
    let img = article.querySelector('.cmp-image-list__item-image img');
    // Defensive fallback: if not found, skip this card
    if (!img) return;

    // --- TEXT CELL ---
    // Title (as heading)
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let titleHref = titleLink ? titleLink.getAttribute('href') : '';
    let titleEl;
    if (titleText) {
      titleEl = document.createElement('strong');
      if (titleHref) {
        const link = document.createElement('a');
        link.href = titleHref;
        link.textContent = titleText;
        titleEl.appendChild(link);
      } else {
        titleEl.textContent = titleText;
      }
    }

    // Description
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = descSpan ? descSpan.cloneNode(true) : null;

    // Compose text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    // Add row: [image, text]
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
