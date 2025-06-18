/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const rows = [];

  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: only the <img>
    let img = article.querySelector('img');

    // Text cell: title (as strong, linked), then description
    const cellContent = [];
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    const descSpan = article.querySelector('span.cmp-image-list__item-description');

    if (titleLink && titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.appendChild(strong);
      cellContent.push(a);
    } else if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      cellContent.push(strong);
    }
    if (descSpan) {
      if (cellContent.length > 0) cellContent.push(document.createElement('br'));
      cellContent.push(descSpan);
    }
    if (!cellContent.length) cellContent.push('');

    rows.push([img || '', cellContent.length === 1 ? cellContent[0] : cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
