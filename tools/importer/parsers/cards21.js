/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as required
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find all card list items
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cardItems.forEach((li) => {
    // --- IMAGE CELL ---
    // Locate the image element
    let imgEl = null;
    const imgContainer = li.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // --- TEXT CELL ---
    // Title
    let titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Description
    let descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    const textCellElements = [];
    if (titleSpan) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
      textCellElements.push(titleEl);
    }
    if (descSpan && descSpan.textContent.trim()) {
      // Add break only if there's a title above
      if (titleSpan) textCellElements.push(document.createElement('br'));
      textCellElements.push(document.createTextNode(descSpan.textContent.trim()));
    }
    // If no title or description, leave blank cell
    let textCellRef = textCellElements.length ? textCellElements : '';

    cells.push([imgEl, textCellRef]);
  });

  // Build and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
