/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards27) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Find all card items (li.cmp-image-list__item)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Image: Find the img element inside the card
    const img = li.querySelector('img');
    let imageCell = img || document.createTextNode('');

    // Text content cell: Title (as heading), Description
    const textFragments = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Create heading element (h3)
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textFragments.push(heading);
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textFragments.push(descP);
    }
    rows.push([imageCell, textFragments]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
