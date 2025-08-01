/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match example
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all direct li.card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((li) => {
    // IMAGE CELL
    // Use the <img> inside the .cmp-image-list__item-image-link
    let imageCell = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // TEXT CELL
    const textCellContent = [];

    // The title: .cmp-image-list__item-title-link > span
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for heading style, wrap with link
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        // Link
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        textCellContent.push(a);
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Add <br> only if there's a title
      if (textCellContent.length) textCellContent.push(document.createElement('br'));
      textCellContent.push(desc);
    }
    // fallback: if no title or description, add empty string
    if (!textCellContent.length) textCellContent.push('');

    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
