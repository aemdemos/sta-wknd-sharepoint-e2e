/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header must match: Cards (cards30)
  const headerRow = ['Cards (cards30)'];
  const rows = [];

  // Find all direct card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Each card: image (left cell), text (right cell)
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find first <img> inside image container
    let imageCell = null;
    const imgDiv = article.querySelector('.cmp-image-list__item-image img');
    if (imgDiv) {
      imageCell = imgDiv;
    } else {
      // fallback: no image
      imageCell = document.createElement('span');
      imageCell.textContent = '';
    }

    // Text cell: build array of elements
    const textCellElements = [];

    // Title: should be a heading. Source is a <span> inside <a> (title-link)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use a heading. Use h3 for semantic heading.
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        // The link should wrap the heading
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href') || '';
        link.textContent = titleSpan.textContent;
        h3.appendChild(link);
        textCellElements.push(h3);
      }
    }

    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Wrap in <p> for semantic meaning
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCellElements.push(p);
    }

    rows.push([imageCell, textCellElements]);
  });

  // Final table assembly
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
