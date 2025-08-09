/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find all image-list items (cards)
  const cards = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cards.forEach((card) => {
    // IMAGE (first column)
    let imgEl = null;
    const imgContainer = card.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // TEXT (second column)
    const textDiv = document.createElement('div');

    // Title (as heading, use <strong>)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleLink.textContent.trim();
      textDiv.appendChild(strong);
    }

    // Description
    const descEl = card.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textDiv.appendChild(p);
    }

    rows.push([imgEl, textDiv]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
