/* global WebImporter */
export default function parse(element, { document }) {
  // Gather content rows (2 columns each)
  const rows = [];
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    const img = item.querySelector('img');
    const imageCell = img || '';
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    let titleElem;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        titleElem = a;
      } else {
        titleElem = strong;
      }
    }
    const desc = item.querySelector('.cmp-image-list__item-description');
    const cellContent = [];
    if (titleElem) cellContent.push(titleElem);
    if (desc) {
      cellContent.push(document.createElement('br'));
      cellContent.push(desc);
    }
    rows.push([imageCell, cellContent]);
  });
  // Header row is a single cell (array with one string)
  const tableRows = [
    ['Cards (cards27)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
