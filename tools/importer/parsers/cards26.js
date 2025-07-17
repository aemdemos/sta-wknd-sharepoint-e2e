/* global WebImporter */
export default function parse(element, { document }) {
  // The table must have a header row with ONE column, and each card row with TWO columns
  // Build the header row as a single-cell array
  const cells = [['Cards (cards26)']];

  // Find all card list items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('.cmp-image-list__item-content');
    // First cell: image
    const img = article && article.querySelector('.cmp-image-list__item-image img');
    // Second cell: text content (title + description)
    const textContent = [];
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span && span.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = span.textContent.trim();
        textContent.push(strong);
      }
    }
    const desc = article && article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textContent.push(descDiv);
    }
    // Add the row with two columns
    cells.push([img, textContent]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
