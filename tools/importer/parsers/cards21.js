/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, header row, each row: image | text (title + description)
  const headerRow = ['Cards (cards21)'];
  const rows = [];

  // Find the card container (image-list > ul)
  const list = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!list) return;

  // For each card (li)
  list.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image: find the first img inside the card
    const img = li.querySelector('img');
    // Title: find the span.cmp-image-list__item-title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Description: find the span.cmp-image-list__item-description
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell: title as heading, description as paragraph
    const textCell = [];
    if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.push(heading);
    }
    if (descSpan) {
      const para = document.createElement('p');
      para.textContent = descSpan.textContent;
      textCell.push(para);
    }

    rows.push([img, textCell]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  element.replaceWith(table);
}
