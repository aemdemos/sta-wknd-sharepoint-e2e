/* global WebImporter */
export default function parse(element, { document }) {
  // Create a table where the first row is a single header cell
  const cells = [];
  cells.push(['Cards (cards26)']); // Header row, 1 column

  // Find all card items
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll('li.cmp-image-list__item');
    items.forEach((item) => {
      // Image cell (first column)
      let imageCell = null;
      const imageLink = item.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        const img = imageLink.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          imageCell = imageLink;
        }
      }
      // Text cell (second column)
      const textCell = document.createElement('div');
      const titleLink = item.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) {
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent.trim();
          textCell.appendChild(strong);
        }
      }
      const desc = item.querySelector('.cmp-image-list__item-description');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }
      // Add card row (2 columns)
      cells.push([imageCell, textCell]);
    });
  }

  // Create the table — 1 column for header, 2 columns for subsequent rows
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
