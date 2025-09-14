/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell for each card
  function createTextCell(article) {
    // Find the title link and description
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const description = article.querySelector('.cmp-image-list__item-description');

    // Compose the text cell: title as heading, then description
    const frag = document.createDocumentFragment();
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      frag.appendChild(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      frag.appendChild(p);
    }
    return frag;
  }

  // Find the image-list block
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards21)']);

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the <img> inside the image link
    let img = null;
    const imgLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!img) return;

    // Text cell
    const textCell = createTextCell(article);

    rows.push([img, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
