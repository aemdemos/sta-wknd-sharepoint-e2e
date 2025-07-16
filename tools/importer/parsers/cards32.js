/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly as in requirements
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // --- IMAGE CELL ---
    // Image: inside .cmp-image-list__item-image-link > .cmp-image-list__item-image > img
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // --- TEXT CELL ---
    // Title: .cmp-image-list__item-title-link (possibly a link)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      // wrap the title in <strong>, and keep the link
      const strong = document.createElement('strong');
      if (titleLink.tagName === 'A') {
        // Use the existing link, not a clone
        strong.appendChild(titleLink);
      } else {
        strong.textContent = titleLink.textContent.trim();
      }
      titleEl = strong;
    }

    // Description: .cmp-image-list__item-description
    const descEl = item.querySelector('.cmp-image-list__item-description');
    let descNode = null;
    if (descEl && descEl.textContent.trim()) {
      // Use the existing element, but as a <div> for block spacing
      descNode = document.createElement('div');
      descNode.textContent = descEl.textContent.trim();
    }

    // Compose the text cell contents
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descNode) textCellContent.push(descNode);

    // Add this card row if it has at least an image and text (skip empty)
    if (imageEl || textCellContent.length) {
      rows.push([
        imageEl,
        textCellContent
      ]);
    }
  });

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
