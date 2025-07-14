/* global WebImporter */
export default function parse(element, { document }) {
  // Desired header: single column matching the example markdown
  const headerRow = ['Carousel (carousel28)'];

  // Extract image for the left column
  let imageCell = '';
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = teaserImageDiv;
    }
  }

  // Extract text content for the right column
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let textCellContent = [];
  if (contentDiv) {
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      if (/^h[1-6]$/i.test(title.tagName)) {
        textCellContent.push(title);
      } else {
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML;
        textCellContent.push(h2);
      }
    }
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      if (desc.tagName.toLowerCase() === 'p') {
        textCellContent.push(desc);
      } else {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        textCellContent.push(p);
      }
    }
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCellContent.push(cta);
    }
  }
  let textCell = textCellContent.length ? textCellContent : '';

  // Compose table rows: header row is 1 column, slide row is 2 columns
  const rows = [
    headerRow,                  // single cell header row
    [imageCell, textCell],      // slide row with two cells
  ];

  // Use a custom version of createTable so header row is always a single cell
  // and slide rows can have more columns. This matches the markdown example.
  const table = document.createElement('table');
  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.colSpan = 2;
  th.innerHTML = headerRow[0];
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Slide rows
  for (let i = 1; i < rows.length; i++) {
    const tr = document.createElement('tr');
    const row = rows[i];
    for (const cell of row) {
      const td = document.createElement('td');
      if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (typeof cell === 'string') {
        if (cell) td.innerHTML = cell;
      } else if (cell) {
        td.append(cell);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  element.replaceWith(table);
}
