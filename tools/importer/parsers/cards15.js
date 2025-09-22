/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the text cell for each card
  function buildTextCell(titleLink, titleSpan, descSpan) {
    const frag = document.createDocumentFragment();
    if (titleSpan) {
      // Create heading (h3) with link if possible
      const h3 = document.createElement('h3');
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.textContent = titleSpan.textContent;
        h3.appendChild(a);
      } else {
        h3.textContent = titleSpan.textContent;
      }
      frag.appendChild(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      frag.appendChild(p);
    }
    return frag;
  }

  // Get all cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Table header
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Image: find the <img> inside the image link
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imageLink) {
      img = imageLink.querySelector('img');
    }
    // Title: <a class="cmp-image-list__item-title-link"> <span class="cmp-image-list__item-title">
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Description: <span class="cmp-image-list__item-description">
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Build text cell
    const textCell = buildTextCell(titleLink, titleSpan, descSpan);

    // Add row: [image, text cell]
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
