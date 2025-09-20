/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all cards (li elements)
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  // Table header: must match block name exactly
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element (reference, do not clone)
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Find title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Find description
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell as an array of elements
    const textCell = [];
    if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.push(heading);
    }
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.push(descP);
    }

    // Always reference the existing image element (do not clone)
    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
