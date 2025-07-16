/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must have two columns to match data rows
  const headerRow = ['Cards (cards27)', ''];
  const cells = [headerRow];

  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Image in first column
    let imgElem = item.querySelector('.cmp-image-list__item-image img');

    // Prepare text cell: title as strong+link, description as block
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const desc = item.querySelector('.cmp-image-list__item-description');

    let textCell = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        textCell.push(a);
      } else {
        textCell.push(strong);
      }
    }
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textCell.push(descDiv);
    }
    cells.push([
      imgElem,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
