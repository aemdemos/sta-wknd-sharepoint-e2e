/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block parsing
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  if (!items.length) return;

  const rows = [];
  // Header row: block name, single cell only (no extra columns)
  rows.push(['Cards (cards26)']);

  items.forEach((li) => {
    let img = li.querySelector('img');
    let imageCell;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (img && imageLink) {
      imageCell = imageLink;
    } else if (img) {
      imageCell = img;
    } else {
      imageCell = '';
    }

    const textElements = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.appendChild(titleSpan);
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(h3);
        textElements.push(a);
      }
    }
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textElements.push(desc);
    }
    rows.push([imageCell, textElements]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
