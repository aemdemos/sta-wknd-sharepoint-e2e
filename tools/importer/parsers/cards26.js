/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards26)'];
  const rows = [];

  // Defensive: locate the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) {
    // If no list, replace with just the header
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // 1st cell: Image
    let imageEl = null;
    const img = item.querySelector('img');
    if (img) imageEl = img;

    // 2nd cell: Textual content
    const article = item.querySelector('article.cmp-image-list__item-content');
    const frag = document.createDocumentFragment();
    // Title: Try to keep semantic, bold if possible
    let titleAdded = false;
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const title = document.createElement('strong');
        title.textContent = titleSpan.textContent;
        frag.appendChild(title);
        titleAdded = true;
      }
    }
    // Description: as paragraph (separate)
    const descSpan = article && article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = descSpan.textContent;
      frag.appendChild(para);
    }
    // Always supply a node in the cell
    rows.push([imageEl, frag]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
