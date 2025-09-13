/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell for each card
  function createTextCell(titleLink, description) {
    // Defensive: titleLink may be null
    let frag = document.createDocumentFragment();
    if (titleLink) {
      // Use the title text as heading (h3)
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        frag.appendChild(h3);
      }
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      frag.appendChild(p);
    }
    // Optionally, add CTA if needed (not present in this HTML)
    return frag;
  }

  // Find the image-list block
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each item is a card
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // Image cell: find the <img> inside the image link
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imageLink) {
      img = imageLink.querySelector('img');
    }
    // Text cell: title and description
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const description = article.querySelector('.cmp-image-list__item-description');
    const textCell = createTextCell(titleLink, description);
    // Only add row if image and text are present
    if (img && textCell) {
      rows.push([img, textCell]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
