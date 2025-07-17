/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name and variant
  const headerRow = ['Cards (cards21)'];
  const rows = [];
  // Find the UL directly under image-list/list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  // For each LI in the UL
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // FIRST COLUMN: Card image (first <img> tag found in the card)
    const img = li.querySelector('img');
    // SECOND COLUMN: Card text (title and description, in correct order)
    // Find the title (span, possibly inside a link)
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Find the description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Build the text cell content as per semantic (strong for title, text for description)
    const textCell = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
      // Only add a <br> if description is present
      if (descSpan && descSpan.textContent.trim()) {
        textCell.push(document.createElement('br'));
      }
    }
    if (descSpan && descSpan.textContent.trim()) {
      textCell.push(document.createTextNode(descSpan.textContent.trim()));
    }
    rows.push([
      img,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}