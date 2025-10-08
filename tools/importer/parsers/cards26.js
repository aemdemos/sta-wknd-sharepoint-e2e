/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block parsing

  // 1. Header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // 2. Find the card container (ul with card items)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // 3. For each card (li)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // --- Image cell ---
    // Find the image inside the card
    let img = li.querySelector('img');
    // Defensive: if image is wrapped in a link, use the link as the cell
    let imageCell;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink && img) {
      // Use the link, but only keep the image inside
      // Remove all children except the image
      const link = imgLink.cloneNode(false);
      link.appendChild(img);
      imageCell = link;
    } else if (img) {
      imageCell = img;
    } else {
      imageCell = '';
    }

    // --- Text cell ---
    // Title (as heading)
    let title = li.querySelector('.cmp-image-list__item-title');
    let titleText = title ? title.textContent.trim() : '';
    let titleEl;
    if (titleText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
    }
    // Description
    let desc = li.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (desc) {
      descEl = document.createElement('p');
      descEl.textContent = desc.textContent.trim();
    }
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    rows.push([imageCell, textCell]);
  });

  // 4. Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
