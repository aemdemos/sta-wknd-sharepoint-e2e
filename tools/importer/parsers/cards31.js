/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const cells = [['Cards (cards31)']];

  // Get all card elements
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Grab image (reference to the actual img in the DOM)
    let imgEl = null;
    const imgLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Build text cell: title (strong) and description (text)
    const textCell = document.createElement('div');
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.appendChild(strong);
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    }

    cells.push([
      imgEl,
      textCell
    ]);
  });

  // Create the cards table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
