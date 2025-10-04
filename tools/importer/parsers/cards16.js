/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row
  const headerRow = ['Cards (cards16)'];

  // Find all immediate card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  items.forEach((item) => {
    // Each card's content is in <article>
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the <img> inside the image link
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Title: find the <span class="cmp-image-list__item-title">
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Description: find the <span class="cmp-image-list__item-description">
    const descEl = article.querySelector('.cmp-image-list__item-description');

    // Compose the text cell: Title (bold), Description (below)
    const textCell = document.createElement('div');
    if (titleEl) {
      const titleDiv = document.createElement('div');
      titleDiv.style.fontWeight = 'bold';
      titleDiv.style.marginBottom = '4px';
      titleDiv.textContent = titleEl.textContent;
      textCell.appendChild(titleDiv);
    }
    if (descEl) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descEl.textContent;
      textCell.appendChild(descDiv);
    }

    // Compose the row: [image, text]
    const row = [imgEl, textCell];
    rows.push(row);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
