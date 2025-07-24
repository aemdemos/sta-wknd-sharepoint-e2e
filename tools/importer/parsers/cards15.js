/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Cards (cards15)'];
  const rows = [];
  // Select all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image cell: Find the main image element referenced in the card
    const img = item.querySelector('img');

    // Text cell: create a fragment with title (as heading/strong) and description (plain text)
    const textCell = document.createElement('div');
    // Title (bold as per spec)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.appendChild(strong);
      }
    }
    // Description (on new line)
    const descSpan = item.querySelector('span.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    }
    rows.push([img, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
