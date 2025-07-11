/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, matching the example
  const cells = [['Cards (cards26)']];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    // IMAGE CELL
    let imageCell = null;
    const img = li.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = document.createTextNode('');
    }

    // TEXT CELL
    const textFragments = [];
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Use <strong> for bold/heading effect as in the visual example
      const strong = document.createElement('strong');
      if (titleLink) {
        // Reference the existing <a> (including its child <span>)
        strong.appendChild(titleLink);
      } else {
        strong.textContent = titleSpan.textContent;
      }
      textFragments.push(strong);
    }
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim() !== '') {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textFragments.push(p);
    }
    // Each card row: [image cell, text cell]
    cells.push([imageCell, textFragments]);
  });

  // Create block table with proper header row (1 cell) and card rows (2 cells)
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
