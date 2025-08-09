/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Cards (cards21)'];
  // Get all cards
  const items = element.querySelectorAll('li.cmp-image-list__item');
  const rows = [headerRow];
  items.forEach(item => {
    // Image extraction (reference existing <img> element)
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      const imgContainer = imgLink.querySelector('.cmp-image');
      if (imgContainer) {
        imgEl = imgContainer.querySelector('img');
      }
    }
    // Title extraction (reference existing <span>)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    }
    // Description extraction (reference existing <span>)
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    // Compose text cell content preserving semantic meaning
    const cellContent = [];
    if (titleSpan) {
      // Title as <strong> (matches example style)
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      cellContent.push(strong);
    }
    if (descSpan) {
      // Insert <br> if both title and description
      if (cellContent.length > 0) {
        cellContent.push(document.createElement('br'));
      }
      cellContent.push(descSpan);
    }
    // Edge case: if no title nor description, just add empty cell
    if (cellContent.length === 0) {
      cellContent.push('');
    }
    // Always reference existing elements; do not clone
    rows.push([imgEl, cellContent]);
  });
  // Create table using helper function
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
