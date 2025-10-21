/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the image-list container (holds all cards)
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) {
    // Defensive: If not found, do nothing
    return;
  }

  // Each card is a <li class="cmp-image-list__item">
  const cardItems = imageList.querySelectorAll('li.cmp-image-list__item');
  cardItems.forEach((li) => {
    // Card image: find the <img> inside the card
    const img = li.querySelector('img');
    // Card title: find the <span class="cmp-image-list__item-title">
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Card description: find the <span class="cmp-image-list__item-description">
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Defensive: If no image or no text, skip
    if (!img || (!titleSpan && !descSpan)) return;

    // Build text cell: Title as heading, description below
    const textCell = document.createElement('div');
    if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    if (descSpan) {
      const desc = document.createElement('p');
      desc.textContent = descSpan.textContent;
      textCell.appendChild(desc);
    }

    // Row: [image, textCell]
    rows.push([img, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
