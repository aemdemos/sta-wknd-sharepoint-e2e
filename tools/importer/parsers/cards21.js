/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row as per block definition
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find the cards list from input
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((li) => {
      // Image: use the first <img> inside .cmp-image-list__item-image-link
      let imageEl = null;
      const imageLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        imageEl = imageLink.querySelector('img');
      }

      // Title: get the .cmp-image-list__item-title (inside .cmp-image-list__item-title-link)
      let titleEl = null;
      const titleSpan = li.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for title as in the block spec
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent;
      }

      // Description: get the .cmp-image-list__item-description
      let descEl = null;
      const descSpan = li.querySelector('.cmp-image-list__item-description');
      if (descSpan) {
        descEl = document.createElement('p');
        descEl.textContent = descSpan.textContent.trim();
      }

      // Compose the right cell: title (if present), then description (if present)
      // as an array: [strong, p]
      const textContent = [];
      if (titleEl) textContent.push(titleEl);
      if (descEl) textContent.push(descEl);

      // If text is totally missing, fallback to empty string so table stays valid
      if (textContent.length === 0) textContent.push('');

      cells.push([
        imageEl || '',
        textContent
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
