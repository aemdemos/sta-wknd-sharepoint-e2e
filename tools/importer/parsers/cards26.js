/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find the card container (ul)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Find all card items (li)
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    // Find image (first cell)
    let img = li.querySelector('img');
    // Defensive: if image is wrapped in a link, use the whole link
    let imageCell;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink && imgLink.contains(img)) {
      // Only append the <a> with its <img> child, not extra wrappers
      const a = document.createElement('a');
      a.href = imgLink.href;
      a.appendChild(img.cloneNode(true));
      imageCell = a;
    } else if (img) {
      imageCell = img;
    } else {
      imageCell = document.createTextNode('');
    }

    // Find text content (second cell)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    const textCell = document.createElement('div');
    // Title as bold and link if present
    if (titleLink && titleSpan) {
      const bold = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleSpan.textContent;
      bold.appendChild(a);
      textCell.appendChild(bold);
    } else if (titleSpan) {
      const bold = document.createElement('strong');
      bold.textContent = titleSpan.textContent;
      textCell.appendChild(bold);
    }
    // Description (if present)
    if (descSpan) {
      const desc = document.createElement('div');
      desc.textContent = descSpan.textContent;
      textCell.appendChild(desc);
    }
    rows.push([imageCell, textCell]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
