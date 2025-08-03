/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all cards
  const cards = Array.from(element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item'));
  // Build body rows: each is [image, text content]
  const bodyRows = cards.map(card => {
    const img = card.querySelector('.cmp-image-list__item-image img');
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    const title = card.querySelector('.cmp-image-list__item-title');
    const desc = card.querySelector('.cmp-image-list__item-description');
    const textContent = [];
    if (title) {
      const strong = document.createElement('strong');
      if (titleLink) {
        strong.appendChild(titleLink);
      } else {
        strong.textContent = title.textContent;
      }
      textContent.push(strong);
    }
    if (desc) {
      if (textContent.length) textContent.push(document.createElement('br'));
      textContent.push(desc);
    }
    return [img, textContent];
  });
  // Build table manually to ensure proper header colspan
  const table = document.createElement('table');
  // Header row with colspan=2
  const trHead = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Cards (cards26)';
  th.setAttribute('colspan', '2');
  trHead.appendChild(th);
  table.appendChild(trHead);
  // Add card rows
  bodyRows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (cell instanceof Node) {
        td.append(cell);
      } else {
        td.innerHTML = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  element.replaceWith(table);
}
