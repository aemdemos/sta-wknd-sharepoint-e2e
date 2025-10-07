/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block parsing
  // 1. Header row (single cell, per guidelines)
  const headerRow = ['Cards (cards31)'];

  // 2. Find all card items (li elements)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Image
    const imageEl = li.querySelector('.cmp-image-list__item-image img');
    // Title link and title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell as flat structure (no nested divs)
    const textCell = document.createElement('div');
    if (titleSpan) {
      let heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        let link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(heading);
        textCell.appendChild(link);
      } else {
        textCell.appendChild(heading);
      }
      textCell.appendChild(document.createElement('br'));
    }
    if (descSpan) {
      // DO NOT truncate description, include full text
      textCell.appendChild(document.createTextNode(descSpan.textContent));
    }

    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
