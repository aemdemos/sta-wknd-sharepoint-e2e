/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find the parent UL containing all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Each LI is a card
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Image: find the img inside the card
    const img = li.querySelector('img');
    // Defensive: if no image, skip this card
    if (!img) return;

    // Text content: title, description, link
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    const descriptionSpan = li.querySelector('span.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    // Title (as heading, wrapped in link if present)
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(heading);
        textCell.appendChild(link);
      } else {
        textCell.appendChild(heading);
      }
    }
    // Description
    if (descriptionSpan) {
      const desc = document.createElement('div');
      desc.textContent = descriptionSpan.textContent;
      textCell.appendChild(desc);
    }

    rows.push([img, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
