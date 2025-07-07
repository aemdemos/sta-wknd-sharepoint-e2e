/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the list of cards
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  const rows = [];
  // Header row - must match example exactly
  rows.push(['Cards (cards21)']);
  // For each card/item
  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    // Image cell
    let imgCell = null;
    const imageDiv = article && article.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }
    // Text cell
    const textCell = document.createElement('div');
    // Title (bold, as in the example)
    const titleLink = article && article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // Description
    const desc = article && article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use a <span> for description (could also use <p>, but example is simple text)
      const span = document.createElement('span');
      span.textContent = desc.textContent;
      textCell.appendChild(span);
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}