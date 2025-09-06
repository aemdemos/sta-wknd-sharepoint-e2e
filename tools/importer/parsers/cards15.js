/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the text cell for each card
  function buildTextCell(article) {
    // Title link
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    // Compose cell content
    const cellContent = [];
    if (titleLink) cellContent.push(titleLink);
    if (desc) cellContent.push(document.createElement('br'), desc);
    return cellContent;
  }

  // Find all cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Build a row for each card
  items.forEach((li) => {
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;
    // Image: find the <img> inside the image link
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imageLink) {
      img = imageLink.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!img) return;
    // Text cell
    const textCell = buildTextCell(article);
    rows.push([img, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
