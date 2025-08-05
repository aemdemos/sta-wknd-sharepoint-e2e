/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach(item => {
    // First column: find the card image element
    const img = item.querySelector('img');
    // Second column: assemble title (as strong), and description below
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleStrong = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for the title as per reference example
        titleStrong = document.createElement('strong');
        titleStrong.textContent = titleSpan.textContent;
      }
    }
    const description = item.querySelector('.cmp-image-list__item-description');
    // Compose the text cell: title (strong), br, description
    const textCell = [];
    if (titleStrong) textCell.push(titleStrong);
    if (description) {
      if (titleStrong) textCell.push(document.createElement('br'));
      textCell.push(description);
    }
    rows.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
