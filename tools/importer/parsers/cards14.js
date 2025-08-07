/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards14)'];
  const rows = [];
  // Find all card <li> elements
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Get the image element (img) - must reference the DOM node, not clone
    const img = item.querySelector('.cmp-image-list__item-image img');

    // Get the title link and title span
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let textCellContents = [];
    if (titleLink) {
      // Wrap link in <strong> for semantic emphasis as in example (acts like heading)
      const strong = document.createElement('strong');
      strong.appendChild(titleLink); // reference existing link element in DOM
      textCellContents.push(strong);
    } else {
      // fallback: just strong title span
      const titleSpan = item.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCellContents.push(strong);
      }
    }

    // Get the description (if present), keep semantic paragraph structure
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textCellContents.push(descDiv);
    }
    // Assemble row: image on left, text on right
    rows.push([img, textCellContents]);
  });
  const tableArr = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
