/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block parser
  // Step 1: Header row
  const headerRow = ['Cards (cards25)'];

  // Step 2: Find all card items
  // The cards are in <li class="cmp-image-list__item">
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li.cmp-image-list__item'));

  const rows = [headerRow];

  items.forEach((item) => {
    // Card image (first cell)
    // The image is inside: a.cmp-image-list__item-image-link > div > div > img
    let imgEl = item.querySelector('.cmp-image-list__item-image-link img');
    // Defensive: fallback to any <img> inside the card
    if (!imgEl) imgEl = item.querySelector('img');

    // Card text (second cell)
    // Title is in: a.cmp-image-list__item-title-link > span.cmp-image-list__item-title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Description is in: span.cmp-image-list__item-description
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    // Title (bold, heading style)
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    // Description
    if (descSpan) {
      const desc = document.createElement('div');
      desc.textContent = descSpan.textContent;
      textCell.appendChild(desc);
    }
    // Optionally, add CTA if present (not in this HTML)
    // If the titleLink is present and has an href, but no visible CTA, skip adding a CTA

    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Step 3: Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
