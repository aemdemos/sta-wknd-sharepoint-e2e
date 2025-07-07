/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as found in the example
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];
  // Get the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll('li.cmp-image-list__item');
    items.forEach(item => {
      // Get the card image
      const img = item.querySelector('img');
      // Get the title span and its link (if present)
      const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
      const titleSpan = item.querySelector('span.cmp-image-list__item-title');
      let titleElem;
      if (titleLink && titleSpan) {
        // Create a heading element (strong inside a link for semantic meaning in table)
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        titleElem = a;
      } else if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleElem = strong;
      }
      // Get the description
      const desc = item.querySelector('span.cmp-image-list__item-description');
      // Prepare the cell content: title above description if both exist
      const cellContent = [];
      if (titleElem) cellContent.push(titleElem);
      if (desc && desc.textContent.trim()) {
        // Description as a new div (to preserve line breaks if needed)
        const descDiv = document.createElement('div');
        descDiv.textContent = desc.textContent;
        cellContent.push(descDiv);
      }
      // Add the row: [image, text cell]
      rows.push([
        img,
        cellContent
      ]);
    });
  }
  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
