/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find the parent UL holding all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card (LI)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image: find the first <img> inside the card
    const img = li.querySelector('img');

    // Text content: build a fragment with title and description
    const frag = document.createElement('div');
    // Title: find the .cmp-image-list__item-title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      frag.appendChild(h3);
    }
    // Description: find the .cmp-image-list__item-description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // Optionally, add a CTA if present (not in this example)

    // Add row: [image, text fragment]
    rows.push([img, frag]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
