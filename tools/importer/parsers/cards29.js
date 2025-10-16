/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block parsing
  // Step 1: Header row
  const headerRow = ['Cards (cards29)'];

  // Step 2: Find all card items (li.cmp-image-list__item)
  const cardItems = Array.from(element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item'));

  // Step 3: Build rows for each card
  const rows = cardItems.map((li) => {
    // Find image (img inside .cmp-image-list__item-image)
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }

    // Find title (span.cmp-image-list__item-title inside .cmp-image-list__item-title-link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Find description (span.cmp-image-list__item-description)
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell: Title (bold), then description
    const textCell = document.createElement('div');
    if (titleSpan) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
      textCell.appendChild(titleEl);
      textCell.appendChild(document.createElement('br'));
    }
    if (descSpan) {
      const descEl = document.createElement('span');
      descEl.textContent = descSpan.textContent;
      textCell.appendChild(descEl);
    }

    // Image cell: use image element directly if present
    return [imageEl, textCell];
  });

  // Step 4: Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Step 5: Replace original element
  element.replaceWith(table);
}
