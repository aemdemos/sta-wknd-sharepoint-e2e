/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matching the example
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // First cell: image (reference existing <img> element)
    const imgEl = li.querySelector('img');

    // Second cell: title and description
    const article = li.querySelector('article');
    let titleSpan = article && article.querySelector('.cmp-image-list__item-title');
    let descSpan = article && article.querySelector('.cmp-image-list__item-description');

    // Create text cell, preserving formatting
    const fragments = [];
    if (titleSpan && titleSpan.textContent && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      fragments.push(strong);
    }
    if (descSpan && descSpan.textContent && descSpan.textContent.trim()) {
      // Add a <br> if both title and description
      if (fragments.length) fragments.push(document.createElement('br'));
      fragments.push(document.createTextNode(descSpan.textContent.trim()));
    }
    rows.push([imgEl, fragments]);
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
