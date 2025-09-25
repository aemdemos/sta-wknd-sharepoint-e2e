/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: find all immediate <li> children representing cards
  const list = element.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.classList.contains('cmp-image-list__item'));

  items.forEach((li) => {
    // Find image
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback to any <img> inside
    if (!imgEl) imgEl = li.querySelector('img');

    // Find title (as heading)
    let titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Compose heading element
    let headingEl = null;
    if (titleSpan) {
      headingEl = document.createElement('strong');
      headingEl.textContent = titleSpan.textContent;
    }

    // Find description
    let descEl = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (descEl) textCellContent.push(document.createElement('br'), descEl);

    // If there's a link for CTA, add it (but only if not already used for title)
    // In this source, the title is the link, so we don't duplicate CTA
    // But if you want to add CTA, you could add the titleLink at the end
    // For now, skip CTA as per screenshot and markdown

    // Add row: [image, text]
    rows.push([
      imgEl || '',
      textCellContent
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
