/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the specification
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Get all card list items
  const items = element.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('article');
    // Image cell: use first <img> inside .cmp-image-list__item-image
    let img = article && article.querySelector('.cmp-image-list__item-image img');
    let imgCell = img || '';

    // Text cell
    const textCellContent = [];
    // Title (bold)
    const titleSpan = article && article.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellContent.push(strong);
    }
    // Description (paragraph)
    const descSpan = article && article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCellContent.push(p);
    }
    cells.push([imgCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
