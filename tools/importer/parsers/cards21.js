/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL that contains all the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Find the article that contains the card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // IMAGE: Find first image inside the card (reference existing element)
    const img = article.querySelector('img');
    const imageEl = img || '';
    // TEXT: Reference the title and description
    const frag = document.createElement('div');
    // Title (strong)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('span.cmp-image-list__item-title');
      if (span && span.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = span.textContent.trim();
        frag.appendChild(strong);
        frag.appendChild(document.createElement('br'));
      }
    }
    // Description (if present)
    const desc = article.querySelector('span.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      frag.appendChild(document.createTextNode(desc.textContent.trim()));
    }
    rows.push([imageEl, frag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
