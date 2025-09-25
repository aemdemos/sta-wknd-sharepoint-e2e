/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Defensive: find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image element
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Find title and link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    let titleEl = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
        // Make title a heading (h3)
        titleEl = document.createElement('h3');
        titleEl.textContent = titleText;
      }
    }

    // Find description
    const descEl = item.querySelector('.cmp-image-list__item-description');
    let descText = '';
    let descNode = null;
    if (descEl) {
      descText = descEl.textContent.trim();
      descNode = document.createElement('p');
      descNode.textContent = descText;
    }

    // Compose right cell: title (h3) + description (p)
    const rightCellContent = [];
    if (titleEl) rightCellContent.push(titleEl);
    if (descNode) rightCellContent.push(descNode);

    // Compose row: [image, text]
    const row = [imgEl, rightCellContent];
    rows.push(row);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
