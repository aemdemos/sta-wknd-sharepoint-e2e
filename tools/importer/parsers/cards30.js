/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell (title, description)
  function createTextCell(titleLink, titleSpan, descriptionSpan) {
    const frag = document.createElement('div');
    if (titleSpan) {
      // Title as heading, wrapped in link if present
      let heading;
      if (titleLink && titleLink.href) {
        heading = document.createElement('a');
        heading.href = titleLink.href;
        heading.appendChild(document.createElement('strong')).textContent = titleSpan.textContent;
      } else {
        heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
      }
      frag.appendChild(heading);
      frag.appendChild(document.createElement('br'));
    }
    if (descriptionSpan) {
      frag.appendChild(document.createTextNode(descriptionSpan.textContent));
    }
    return frag;
  }

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  const items = ul ? ul.querySelectorAll('li.cmp-image-list__item') : [];

  const rows = [];
  // Header row
  rows.push(['Cards (cards30)']);

  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image (first cell)
    let imgEl = article.querySelector('.cmp-image-list__item-image img');
    let imageCell = imgEl || '';

    // Title and description (second cell)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const descSpan = article.querySelector('.cmp-image-list__item-description');

    const textCell = createTextCell(titleLink, titleSpan, descSpan);

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
