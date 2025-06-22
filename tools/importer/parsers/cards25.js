/* global WebImporter */
export default function parse(element, { document }) {
  // Build the rows for cards (each with 2 columns)
  const rows = [];
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Card image (first cell)
    let imageCell = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }
    // Card text (second cell)
    const textCell = [];
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.push(strong);
      }
    }
    // Description
    const descEl = item.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      if (textCell.length > 0) {
        textCell.push(document.createElement('br'));
      }
      textCell.push(descEl);
    }
    if (!textCell.length) {
      textCell.push('');
    }
    rows.push([imageCell, textCell]);
  });
  // Header row must be a single cell row (not two columns)
  const cells = [
    ['Cards (cards25)'], // ONLY ONE CELL for header row!
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
