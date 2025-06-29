/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const cells = [['Cards (cards26)']];

  // Get all direct li items for cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');

    // Image: the first <img> inside article
    const img = article.querySelector('.cmp-image-list__item-image img');
    
    // Text content: title (strong with link), then description
    const textDiv = document.createElement('div');
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Move the entire <a> into a <strong>
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      textDiv.appendChild(strong);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textDiv.appendChild(p);
    }

    cells.push([img, textDiv]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
