/* global WebImporter */
export default function parse(element, { document }) {
  // Structure: header is 1 cell, all content rows are 2 cells
  const rows = [ ['Cards (cards25)'] ];
  // Get all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach(item => {
    // First cell: image
    let imageCell = null;
    const image = item.querySelector('.cmp-image-list__item-image-link img');
    if (image) imageCell = image;

    // Second cell: Title (bold and linked) and description
    const cellContent = [];
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // <strong> for heading style, wrapped in <a>
      const strong = document.createElement('strong');
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      strong.textContent = titleSpan ? titleSpan.textContent : titleLink.textContent;
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '#';
      link.appendChild(strong);
      cellContent.push(link);
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      cellContent.push(descDiv);
    }
    rows.push([imageCell, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
