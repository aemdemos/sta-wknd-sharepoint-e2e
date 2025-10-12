/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block parsing
  // Find the image list container
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // Defensive: fallback if imageList is not found
  const ul = imageList ? imageList.querySelector('ul.cmp-image-list') : element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all card items
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));

  // Header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image (always present)
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }
    // Defensive: if no image found, skip this card
    if (!imgEl) return;

    // Find title (inside .cmp-image-list__item-title)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }
    // Find description
    const descEl = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    if (titleEl) {
      // Wrap title in a heading
      const heading = document.createElement('h3');
      heading.textContent = titleEl.textContent;
      textCell.push(heading);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent;
      textCell.push(p);
    }
    // Do NOT add invented CTA text. Only add link if there is visible text.
    // In this HTML, the title is the link, so do not add a separate CTA.
    // If the title is a link, the heading will not be clickable, but that's OK for import.

    // Add row: [image, text]
    rows.push([imgEl, textCell]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
