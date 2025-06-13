/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirement
  const rows = [['Cards (cards26)']];
  // Find all cards (li.cmp-image-list__item)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // IMAGE CELL
    let imgEl = null;
    const img = item.querySelector('img');
    if (img) imgEl = img;
    // TEXT CELL
    const textDiv = document.createElement('div');
    // Title
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textDiv.appendChild(strong);
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textDiv.appendChild(p);
    }
    rows.push([imgEl, textDiv]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
