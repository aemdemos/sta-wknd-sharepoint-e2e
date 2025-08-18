/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: create a header row with a cell that spans two columns
  function createSpanningHeaderRow(label, document) {
    const th = document.createElement('th');
    th.innerHTML = label;
    th.setAttribute('colspan', '2');
    const tr = document.createElement('tr');
    tr.appendChild(th);
    return tr;
  }

  // Find all cards (li elements)
  const ul = element.querySelector('ul');
  const items = ul ? ul.querySelectorAll(':scope > li') : [];

  // Prepare table body rows as arrays (2 columns)
  const rows = Array.from(items).map((li) => {
    // Find image element (first img descendant)
    const img = li.querySelector('img');

    // Find title and link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Fallback: sometimes title might not be in link
    const rawTitle = titleSpan ? titleSpan.textContent : (li.querySelector('.cmp-image-list__item-title') ? li.querySelector('.cmp-image-list__item-title').textContent : '');

    // Find description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    const rawDesc = descSpan ? descSpan.textContent : '';

    // Compose text content block (referencing existing elements, not cloning)
    const textContent = document.createElement('div');
    if (rawTitle) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = rawTitle;
      if (titleLink && titleLink.href) {
        const titleAnchor = document.createElement('a');
        titleAnchor.href = titleLink.href;
        titleAnchor.appendChild(titleEl);
        textContent.appendChild(titleAnchor);
      } else {
        textContent.appendChild(titleEl);
      }
    }
    if (rawDesc) {
      const descEl = document.createElement('div');
      descEl.textContent = rawDesc;
      textContent.appendChild(descEl);
    }

    return [img, textContent];
  });

  // Compose the table
  const table = document.createElement('table');
  // Header row with colspan=2
  table.appendChild(createSpanningHeaderRow('Cards (cards26)', document));
  // Body rows
  const tempTable = WebImporter.DOMUtils.createTable(rows, document);
  Array.from(tempTable.querySelectorAll('tr')).forEach((tr) => {
    table.appendChild(tr);
  });
  // Replace the original element
  element.replaceWith(table);
}
