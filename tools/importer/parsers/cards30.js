/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  // Header row as specified
  const rows = [['Cards (cards30)']];

  items.forEach((li) => {
    // Image extraction
    const img = li.querySelector('img');

    // Title extraction
    let titleElem = null;
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Use strong for card title, with a link if available
        const strong = document.createElement('strong');
        if (titleLink.href) {
          const a = document.createElement('a');
          a.href = titleLink.href;
          a.textContent = span.textContent;
          strong.appendChild(a);
        } else {
          strong.textContent = span.textContent;
        }
        titleElem = strong;
      }
    }

    // Description extraction
    let descElem = null;
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      descElem = document.createElement('div');
      descElem.textContent = desc.textContent;
    }

    // Compose text cell
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) textCell.push(descElem);

    // Always two columns: [image, text content]
    rows.push([
      img || '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
