/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: matches example exactly
  const headerRow = ['Cards (cards14)'];

  // Find all cards in the block
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  items.forEach((item) => {
    // Extract image: reference existing element
    const img = item.querySelector('img');
    let imageEl = null;
    if (img) {
      imageEl = img;
    }

    // Extract title and description
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');

    // Build text content cell
    const textContent = document.createElement('div');

    if (titleSpan) {
      // Heading (level 3, to match card pattern)
      const h3 = document.createElement('h3');
      if (titleLink && titleLink.href) {
        // Reference the actual A element from the DOM (not clone)
        h3.appendChild(titleLink);
      } else {
        h3.textContent = titleSpan.textContent;
      }
      textContent.appendChild(h3);
    }
    if (descriptionSpan) {
      // Reference the actual SPAN for description
      textContent.appendChild(descriptionSpan);
    }
    rows.push([imageEl, textContent]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
