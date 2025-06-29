/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header
  const cells = [
    ['Cards (cards30)']
  ];

  // Locate the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) {
    // If no cards, still replace element with the table header
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Image (mandatory)
    let imageEl = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageEl = imgLink.querySelector('img'); // Reference the existing element
    }

    // Text content (title as heading, description below)
    const frag = document.createDocumentFragment();

    // Title (as Heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        frag.appendChild(h3);
      }
    }

    // Description (if present)
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }

    cells.push([
      imageEl,
      frag
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
