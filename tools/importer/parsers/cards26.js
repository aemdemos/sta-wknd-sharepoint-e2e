/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card (li)
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article containing the card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // 1. Image (first column)
    // Find the image inside the first link
    let imgEl = null;
    const imgLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Defensive: if no image, leave cell empty
    const imgCell = imgEl ? imgEl : '';

    // 2. Text content (second column)
    // Title (inside a link, as span)
    let titleEl = article.querySelector('a.cmp-image-list__item-title-link .cmp-image-list__item-title');
    // Defensive: create a heading if present
    let heading = null;
    if (titleEl) {
      heading = document.createElement('strong');
      heading.textContent = titleEl.textContent.trim();
    }
    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = [];
    if (heading) textCell.push(heading);
    if (descEl) textCell.push(document.createElement('br'), descEl.cloneNode(true));

    rows.push([imgCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
