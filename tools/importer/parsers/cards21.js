/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find the list (<ul>) of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Get all list items (cards)
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Get the image (img element)
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imgLink) {
      const imgEl = imgLink.querySelector('img');
      if (imgEl) {
        img = imgEl;
      }
    }

    // Get the title (span inside a link)
    let title = li.querySelector('.cmp-image-list__item-title');
    // Get the description (span)
    let desc = li.querySelector('.cmp-image-list__item-description');

    // Use a <div> for the content cell for proper HTML semantics
    const cellDiv = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      cellDiv.appendChild(strong);
      cellDiv.appendChild(document.createElement('br'));
    }
    if (desc) {
      cellDiv.append(desc);
    }

    // Add this card as a row
    cells.push([
      img || '',
      cellDiv
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
