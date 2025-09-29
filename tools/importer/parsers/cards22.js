/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list.list, ul.cmp-image-list') || element;
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  // Table header row
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element (reference, not clone)
    let imgEl = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) imgEl = img;
    }

    // Find title
    let title = '';
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    }

    // Find description
    let desc = '';
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      desc = descSpan.textContent.trim();
    }

    // Compose text cell
    const textCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      textCell.appendChild(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textCell.appendChild(p);
    }
    // No CTA in source, so skip

    // Compose row
    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
