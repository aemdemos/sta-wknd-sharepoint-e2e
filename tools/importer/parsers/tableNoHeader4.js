/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list');
  if (!imageList) return;

  // Find all image-list items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Table header row as required
  const headerRow = ['Table (no header, tableNoHeader4)'];
  const rows = [headerRow];

  // For each item, build a row with 1 column: text content only
  items.forEach(item => {
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;
    // Compose cell: title and description
    const titleSpan = content.querySelector('.cmp-image-list__item-title');
    const descSpan = content.querySelector('.cmp-image-list__item-description');
    const cell = document.createElement('div');
    if (titleSpan) cell.appendChild(titleSpan.cloneNode(true));
    if (descSpan) cell.appendChild(descSpan.cloneNode(true));
    rows.push([cell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  imageList.replaceWith(block);
}
