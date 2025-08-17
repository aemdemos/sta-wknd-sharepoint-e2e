/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards14)'];

  // Find all li elements representing cards
  const items = Array.from(element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item'));

  const rows = items.map(item => {
    // IMAGE: find the <img> tag (img is always present and first in card)
    const img = item.querySelector('img');

    // TEXT: Title and Description
    // Find the title span and its link (some sites may want link, but example doesn't render it as link)
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    // It is always inside a link, but for the cell, we just want bold, not a link

    // Find description
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose the text content
    const textCellFragments = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellFragments.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      textCellFragments.push(document.createElement('br'));
      textCellFragments.push(document.createTextNode(descSpan.textContent));
    }

    return [img, textCellFragments];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
