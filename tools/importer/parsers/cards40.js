/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards40)'];
  const cells = [headerRow];

  // Get all card <li> elements
  const cardNodes = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cardNodes.forEach((cardNode) => {
    // Extract image
    let imgEl = null;
    const imageDiv = cardNode.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }
    // Extract title (strong heading as in example)
    let strong = null;
    const titleLink = cardNode.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      strong = document.createElement('strong');
      if (titleSpan) {
        strong.textContent = titleSpan.textContent;
      } else {
        strong.textContent = titleLink.textContent;
      }
    }
    // Extract description
    const desc = cardNode.querySelector('.cmp-image-list__item-description');
    // Compose text cell: heading (strong) then <br> then description (if exists)
    const textCell = [];
    if (strong) textCell.push(strong);
    if (desc) {
      textCell.push(document.createElement('br'));
      textCell.push(desc);
    }
    // Add row to table
    cells.push([
      imgEl,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
