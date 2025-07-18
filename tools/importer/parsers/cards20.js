/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name as in the example
  const headerRow = ['Cards (cards20)'];
  const cells = [headerRow];

  // Find all card items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    const article = item.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // ----- IMAGE CELL -----
    let img = null;
    const imgLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // If no image, leave the cell as null

    // ----- TEXT CELL -----
    const cellContent = [];
    // Title (styled as heading)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        cellContent.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('span.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Add as a <div> for separation
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      cellContent.push(descDiv);
    }
    // We do not add an extra CTA/link, as the title is already a link in the HTML, but in markdown only the heading is used for the title.

    cells.push([img, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
