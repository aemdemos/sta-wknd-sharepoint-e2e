/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the spec
  const headerRow = ['Cards (cards40)'];

  // Locate the image list (card collection)
  let list = element.querySelector('ul.cmp-image-list');
  if (!list) list = element.querySelector('ul');
  if (!list) return;

  // Find all card items
  const items = Array.from(list.querySelectorAll('li.cmp-image-list__item'));

  // Assemble table rows (first is header)
  const rows = [headerRow];

  items.forEach((item) => {
    // IMAGE CELL: find <img> for the card
    let imageElem = item.querySelector('.cmp-image-list__item-image img');
    if (!imageElem) imageElem = item.querySelector('img');

    // TEXT CELL: always title as heading, then description
    const textCell = [];
    const titleElem = item.querySelector('.cmp-image-list__item-title');
    if (titleElem) {
      // Use <strong> for title to reflect semantic bold (per example)
      const strong = document.createElement('strong');
      strong.textContent = titleElem.textContent.trim();
      textCell.push(strong);
      // Only add <br> if description exists
      if (item.querySelector('.cmp-image-list__item-description')) {
        textCell.push(document.createElement('br'));
      }
    }
    const descElem = item.querySelector('.cmp-image-list__item-description');
    if (descElem) {
      // Add description as plain text
      textCell.push(descElem.textContent.trim());
    }

    // Reference existing nodes, do not clone
    rows.push([
      imageElem,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
