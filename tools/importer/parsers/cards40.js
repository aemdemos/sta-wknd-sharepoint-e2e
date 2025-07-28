/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list ul
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Prepare the table header (must match example exactly)
  const cells = [
    ['Cards (cards40)'],
  ];

  items.forEach((item) => {
    // Image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageWrapper = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageWrapper) {
        imageEl = imageWrapper.querySelector('img');
      }
    }

    // Text (second cell)
    const textNodes = [];
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use an h3 element for the title, as a heading
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        textNodes.push(h3);
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Place in a <p>
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textNodes.push(p);
    }

    cells.push([
      imageEl,
      textNodes
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
