/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if element contains the expected list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image (first cell)
    let imgEl = item.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imgEl) {
      // Try to find any img inside the item
      imgEl = item.querySelector('img');
    }

    // Compose text cell (second cell)
    const textCell = [];

    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Create heading element
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      // If link exists, wrap heading in link
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(heading);
        textCell.push(link);
      } else {
        textCell.push(heading);
      }
    }

    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.push(descP);
    }

    // Compose row: [image, text]
    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
