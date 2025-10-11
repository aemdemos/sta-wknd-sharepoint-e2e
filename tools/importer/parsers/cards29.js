/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block: 2 columns, multiple rows (image | text)
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card (li)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image cell (first column)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Reference the actual image element from the DOM
      const img = imageLink.querySelector('img');
      if (img) imageEl = img;
    }

    // Text cell (second column)
    const textContent = document.createElement('div');
    // Title (as heading, wrapped in link if present)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.textContent = titleSpan.textContent;
        h3.appendChild(a);
      } else {
        h3.textContent = titleSpan.textContent;
      }
      textContent.appendChild(h3);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.appendChild(p);
    }
    // No explicit CTA in this HTML, but if there were, it would go here

    rows.push([
      imageEl || '',
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
