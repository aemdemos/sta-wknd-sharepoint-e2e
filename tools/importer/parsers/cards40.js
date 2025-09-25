/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  // Defensive: find the image list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    // Find the image element
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Find the title and description
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    const textCell = [];
    if (titleSpan) {
      // Create heading element for title
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.push(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCell.push(p);
    }

    // Compose the row: [image, text]
    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
