/* global WebImporter */
export default function parse(element, { document }) {
  // Get all <li> card elements
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  // Build card rows (always two columns: image, text)
  const rows = Array.from(items).map((item) => {
    // Get image element (reference existing <img>)
    const img = item.querySelector('img');
    // Get title (textContent from .cmp-image-list__item-title inside the title link)
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }
    // Get description (reference existing span)
    const desc = item.querySelector('.cmp-image-list__item-description');
    // Build cell 2 contents
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (desc) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }
    return [img || '', textCell.length ? textCell : ''];
  });

  // The header row: two cells, only the first has the label, second is empty
  const headerRow = ['Cards (cards27)', ''];

  // Compose the table with header first, then rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Set colspan=2 for the header cell so it matches the structure in the example
  const headerTh = table.querySelector('tr:first-child > th:first-child');
  if (headerTh) headerTh.setAttribute('colspan', '2');
  // Remove the now-empty second th cell if it was created
  const headerTr = table.querySelector('tr:first-child');
  if (headerTr && headerTr.children.length > 1) {
    headerTr.removeChild(headerTr.children[1]);
  }

  element.replaceWith(table);
}
