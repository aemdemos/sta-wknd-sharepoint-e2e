/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match block name per instructions
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all cards/items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // --- IMAGE CELL ---
    let imageCell = '';
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the first img inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    const textCell = document.createElement('div');

    // Title: should be strong (not heading as example uses bold)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // Description (may not exist)
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descText = document.createTextNode(desc.textContent.trim());
      textCell.appendChild(descText);
    }

    rows.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}