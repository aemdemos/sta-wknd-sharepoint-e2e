/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header exactly as required
  const rows = [['Cards (cards26)']];

  // Get all cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    // Article is the main content block for a card
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // ----- LEFT CELL: Image -----
    // Get the first image (not cloning, just referencing)
    let img = article.querySelector('.cmp-image-list__item-image img');
    let leftCell = img || '';

    // ----- RIGHT CELL: Heading (title, as link if present), then description -----
    let rightCellContent = [];
    // Title
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    let titleText = '';
    let titleHref = '';
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
        titleHref = titleLink.getAttribute('href');
      }
    }
    // Create heading (h3) with link if available
    if (titleText) {
      const h3 = document.createElement('h3');
      if (titleHref) {
        const a = document.createElement('a');
        a.href = titleHref;
        a.textContent = titleText;
        h3.appendChild(a);
      } else {
        h3.textContent = titleText;
      }
      rightCellContent.push(h3);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      rightCellContent.push(desc); // Use the reference directly
    }

    rows.push([leftCell, rightCellContent]);
  });

  // Create block table & replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
