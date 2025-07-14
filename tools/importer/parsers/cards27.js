/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (one column)
  const headerRow = ['Cards (cards27)'];
  const rows = [];

  // Find the list of card <li> elements
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Image in first cell
    let imgEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Text content in second cell
    const textCell = document.createElement('div');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        textCell.appendChild(a);
      }
    }
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      if (textCell.childNodes.length > 0) {
        textCell.appendChild(document.createElement('br'));
      }
      textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    }
    if (textCell.childNodes.length === 0) {
      textCell.textContent = '';
    }
    rows.push([imgEl, textCell]);
  });

  // Build the table: first row is single cell header, all data rows are two cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
