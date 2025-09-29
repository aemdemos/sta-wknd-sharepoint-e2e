/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as required by block spec
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Defensive: Find all immediate li items (cards)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Image: find the img inside the card
    const img = li.querySelector('img');
    // Defensive: If no image, skip this card
    if (!img) return;

    // Title: find the span with class cmp-image-list__item-title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleText = '';
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    }

    // Description: find the span with class cmp-image-list__item-description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descText = '';
    if (descSpan) {
      descText = descSpan.textContent.trim();
    }

    // Compose text cell: Title (bold), Description
    const textCell = document.createElement('div');
    if (titleText) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
      textCell.appendChild(titleEl);
      textCell.appendChild(document.createElement('br'));
    }
    if (descText) {
      const descEl = document.createElement('span');
      descEl.textContent = descText;
      textCell.appendChild(descEl);
    }

    // Add the card row: [image, text content]
    rows.push([img, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
