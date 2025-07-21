/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card items in the list
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Header row as per example
  const rows = [['Cards (cards15)']];

  // Helper to check if a node is an element node
  function isElement(node) {
    return node && node.nodeType === 1;
  }

  // For each card item, extract image and text
  items.forEach((item) => {
    // Image cell: use the <img> element directly
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Text cell: title (strong), and description (span)
    // Title link and span
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Build text cell content
    const textCellParts = [];
    if (titleSpan) {
      // Use <strong> for title
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellParts.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      if (titleSpan) {
        textCellParts.push(document.createElement('br'));
      }
      textCellParts.push(descSpan);
    }

    // Push row: [image, text]
    rows.push([
      imgEl,
      textCellParts.length > 1 ? textCellParts : textCellParts[0] || ''
    ]);
  });

  // Create the cards table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
