/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL containing all cards
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));

  const rows = [];
  // Header - must match the example exactly
  rows.push(['Cards (cards20)']);

  for (const item of items) {
    // 1st column: Image (reference the actual <img> element)
    let imageCell = null;
    const img = item.querySelector('img');
    if (img) imageCell = img;
    // 2nd column: Title as heading + Description
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    const textCell = document.createElement('div');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      textCell.appendChild(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCell.appendChild(p);
    }
    rows.push([imageCell, textCell]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
