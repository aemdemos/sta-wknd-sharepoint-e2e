/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Select all direct card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // IMAGE CELL
    let imageCell = null;
    const imageDiv = item.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        imageCell = imageDiv;
      }
    }

    // TEXT CELL
    const textCellContent = [];
    // Title as heading (bold)
    const titleAnchor = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleAnchor ? titleAnchor.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellContent.push(strong);
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Line break if there is a title
      if (textCellContent.length > 0) textCellContent.push(document.createElement('br'));
      textCellContent.push(document.createTextNode(descSpan.textContent.trim()));
    }
    // If there is a title link and it's not already represented (no explicit CTA needed as per example)
    // (No CTA in provided HTML, so we skip this.)

    // Add row only if there is at least an image or text
    if (imageCell || textCellContent.length > 0) {
      cells.push([
        imageCell || '',
        textCellContent.length > 0 ? textCellContent : ''
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
