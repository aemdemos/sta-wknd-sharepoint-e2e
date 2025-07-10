/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards32)'];
  const cells = [headerRow];

  // Get all <li class="cmp-image-list__item">
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    // Image (first column, always present)
    const imgEl = li.querySelector('.cmp-image-list__item-image img');

    // Text content for the second column
    const cellContent = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descEl = li.querySelector('.cmp-image-list__item-description');

    // Title with link if available, else just title
    if (titleLink && titleSpan) {
      cellContent.push(titleLink);
    } else if (titleSpan) {
      cellContent.push(titleSpan);
    }
    // Add description if present
    if (descEl) {
      // Add a <br> between title and description for block effect
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(descEl);
    }

    // Each card row: [image, text content]
    cells.push([imgEl, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}