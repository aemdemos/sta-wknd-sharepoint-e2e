/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block parsing
  // 1. Header row: must be exactly one column, per guidelines
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Image: find the <img> inside the card
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let imageCell = '';
    if (imgLink) {
      imageCell = imgLink;
    } else {
      const img = li.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: title (with link as heading), description
    const textCell = document.createElement('div');
    // Title (as heading, preserve link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent.trim();
      h3.appendChild(a);
      textCell.appendChild(h3);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent;
      textCell.appendChild(descP);
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
