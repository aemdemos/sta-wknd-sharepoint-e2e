/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find the UL of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach(item => {
    // First cell: Image
    const img = item.querySelector('.cmp-image-list__item-image img');

    // Second cell: Text content (title and description)
    // Title is inside the link with class 'cmp-image-list__item-title-link' and span 'cmp-image-list__item-title'
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleElem = null;
    if (titleLink) {
      // For accessibility and to match the example: use strong for title text
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        titleElem = document.createElement('strong');
        titleElem.textContent = span.textContent.trim();
      }
    }
    // Description text
    const desc = item.querySelector('.cmp-image-list__item-description');
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (desc) {
      if (titleElem) textCell.push(document.createElement('br'));
      // Use the actual node for semantic meaning (not just text)
      textCell.push(desc);
    }
    rows.push([
      img,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
