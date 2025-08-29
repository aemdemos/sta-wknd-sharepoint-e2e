/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirements
  const headerRow = ['Cards (cards26)'];

  // Find the UL containing the cards
  const ul = element.querySelector('ul');
  const rows = [];

  if (ul) {
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // First column: the card image
      const img = li.querySelector('.cmp-image-list__item-image img');
      // Second column: title and description
      const titleSpan = li.querySelector('.cmp-image-list__item-title');
      const desc = li.querySelector('.cmp-image-list__item-description');
      // Build the text cell content
      const textCellContent = [];
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCellContent.push(strong);
      }
      if (desc && desc.textContent.trim()) {
        textCellContent.push(document.createElement('br'));
        textCellContent.push(desc);
      }
      rows.push([
        img || '',
        textCellContent.length ? textCellContent : ''
      ]);
    });
  }

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
