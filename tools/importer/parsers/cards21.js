/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of cards (ul > li)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Table header matches exactly
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Find image
    const image = li.querySelector('img');

    // Find title (span inside a link)
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    
    // Find description
    const desc = li.querySelector('.cmp-image-list__item-description');

    // Text cell construction
    const textCell = document.createDocumentFragment();
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.appendChild(strong);
    }
    if (desc && desc.textContent.trim()) {
      if (titleSpan) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(desc.textContent.trim()));
    }
    rows.push([
      image,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
