/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Defensive: Find all li.cmp-image-list__item inside the element
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((li) => {
    // Get the <img> element (first one in the card)
    const img = li.querySelector('div.cmp-image-list__item-image img');
    // Get the title <span>
    const titleSpan = li.querySelector('span.cmp-image-list__item-title');
    // Get the description <span>
    const descSpan = li.querySelector('span.cmp-image-list__item-description');

    // First cell: the image element (referenced, not cloned)
    const imageCell = img;

    // Second cell: title (bold), then description as text, both in a single cell
    const textCellElems = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellElems.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      if (titleSpan) textCellElems.push(document.createElement('br'));
      textCellElems.push(document.createTextNode(descSpan.textContent.trim()));
    }

    // Add the row for this card
    cells.push([imageCell, textCellElems]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
