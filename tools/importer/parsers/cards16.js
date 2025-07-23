/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly the required block name
  const cells = [['Cards (cards16)']];

  // Get all cards (list items)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // IMAGE CELL: reference the <img> directly
    let imageEl = item.querySelector('.cmp-image-list__item-image img');
    
    // TEXT CELL: build structure from title (as heading+link) and description
    const textCell = [];
    // Title as heading, with link (as in example block, strong/heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleLink && titleSpan) {
      // Make heading (h3), move link with inner text
      const h3 = document.createElement('h3');
      h3.style.margin = '0'; // Remove margin for consistency if needed
      // Reference the anchor (not clone), but change its children to raw text
      titleLink.textContent = titleSpan.textContent;
      h3.appendChild(titleLink);
      textCell.push(h3);
    }
    // Description as paragraph under heading
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.push(p);
    }
    // Add row of [image, textCell]
    cells.push([
      imageEl,
      textCell,
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
