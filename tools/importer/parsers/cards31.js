/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all LI elements (each card)
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    // Image: find <img> inside the card
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }

    // Title: find the title link and span
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      // Use a heading for the title
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.appendChild(titleSpan.cloneNode(true));
        // If the title is a link, wrap the heading in the link
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(h3);
        titleEl = link;
      }
    }

    // Description: find the description span
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.appendChild(descSpan.cloneNode(true));
    }

    // Compose the text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Compose the row: [image, text]
    rows.push([
      imageEl ? imageEl : '',
      textCell.length ? textCell : ''
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
