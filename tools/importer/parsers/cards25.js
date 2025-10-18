/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards25)'];

  // Find all card items in the image list
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  const rows = [headerRow];

  cardItems.forEach((item) => {
    // Image cell: find the image inside the card
    const img = item.querySelector('img');
    let imageCell = '';
    if (img) {
      imageCell = img;
    }

    // Text cell: title (as heading), description, and link if present
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');
    let textCellContent = [];

    // Title as heading, wrapped in a link if present
    if (titleSpan) {
      let heading;
      if (titleLink) {
        heading = document.createElement('a');
        heading.href = titleLink.href;
        heading.textContent = titleSpan.textContent;
        // Make it look like a heading (h3)
        const h = document.createElement('h3');
        h.appendChild(heading);
        textCellContent.push(h);
      } else {
        const h = document.createElement('h3');
        h.textContent = titleSpan.textContent;
        textCellContent.push(h);
      }
    }
    // Description
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      textCellContent.push(p);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
