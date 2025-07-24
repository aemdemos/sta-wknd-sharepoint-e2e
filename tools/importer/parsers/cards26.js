/* global WebImporter */
export default function parse(element, { document }) {
  // Build rows
  const rows = [];

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      // --- Left Cell: Image ---
      let imageEl = null;
      const imageLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        const img = imageLink.querySelector('img');
        if (img) imageEl = img;
      }

      // --- Right Cell: Text ---
      const textContent = [];
      // Title (as strong)
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const span = titleLink.querySelector('.cmp-image-list__item-title');
        if (span) {
          const strong = document.createElement('strong');
          strong.textContent = span.textContent;
          textContent.push(strong);
        }
      }
      // Description (as plain block)
      const desc = li.querySelector('.cmp-image-list__item-description');
      if (desc) {
        if (textContent.length > 0) textContent.push(document.createElement('br'));
        textContent.push(desc);
      }

      // Add row
      rows.push([
        imageEl || '',
        textContent.length ? textContent : ''
      ]);
    });
  }

  // Header row should be a single column (block name)
  const cells = [
    ['Cards (cards26)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
