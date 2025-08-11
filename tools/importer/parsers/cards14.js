/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Defensive: Find the UL for cards, handle if missing
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) {
    // No cards found, replace with a header block only
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Find the image (should always exist)
    const img = item.querySelector('img');
    // Find the title
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    // Find the description
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text content for cell 2
    const textCellContent = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      // Use <strong> for the title as in the example
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellContent.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      // Use a <div> for the description as in the example (for line-break)
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      textCellContent.push(descDiv);
    }
    // If both missing, insert at least a blank cell to preserve structure
    if (textCellContent.length === 0) {
      textCellContent.push('');
    }

    // img may be null, in which case the cell should be empty
    cells.push([
      img || '',
      textCellContent
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}