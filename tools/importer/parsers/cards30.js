/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards30)'];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  items.forEach((item) => {
    // Image (first cell)
    let img = item.querySelector('.cmp-image-list__item-image img');

    // Title (bolded, second cell)
    let titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let title = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    let titleElem = null;
    if (title) {
      titleElem = document.createElement('strong');
      titleElem.textContent = title.textContent;
    }

    // Description (second cell)
    let desc = item.querySelector('.cmp-image-list__item-description');

    // Compose the second cell: title (bold) on top, then description (if present)
    let textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (desc) {
      if (titleElem) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }

    // If no title or description, leave cell empty
    if (!textCell.length) textCell = [''];

    rows.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
