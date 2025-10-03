/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required by block spec
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: find all immediate <li> children (cards)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Find image (always present)
    const imageLink = item.querySelector('a.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }
    // Defensive fallback: if no image, skip card
    if (!imgEl) return;

    // Find title and description
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    const descSpan = item.querySelector('span.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.appendChild(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCell.appendChild(p);
    }
    // Optionally, add CTA if needed (not present in this HTML)

    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
