/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell for each card
  function createTextCell(titleLink, titleSpan, descriptionSpan) {
    const container = document.createElement('div');
    // Title as heading (h3), optionally wrapped in a link
    if (titleSpan) {
      const h3 = document.createElement('h3');
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.append(titleSpan.textContent);
        h3.append(a);
      } else {
        h3.textContent = titleSpan.textContent;
      }
      container.appendChild(h3);
    }
    // Description
    if (descriptionSpan) {
      const p = document.createElement('p');
      p.textContent = descriptionSpan.textContent;
      container.appendChild(p);
    }
    return container;
  }

  // Start building the table
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards25)']);

  // Find all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      // Image cell: find the <img> inside the image link
      let imgEl = null;
      const imageLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        imgEl = imageLink.querySelector('img');
      }
      // Text cell: title and description
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      const titleSpan = li.querySelector('.cmp-image-list__item-title');
      const descriptionSpan = li.querySelector('.cmp-image-list__item-description');
      const textCell = createTextCell(titleLink, titleSpan, descriptionSpan);
      // Add row if image and text exist
      if (imgEl && textCell) {
        rows.push([imgEl, textCell]);
      }
    });
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
