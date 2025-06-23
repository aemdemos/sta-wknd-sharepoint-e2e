/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block representing the cards
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (!imageList) return;
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  const rows = [['Cards (cards4)']];

  items.forEach(item => {
    // First cell: image element
    let imageCell = null;
    const img = item.querySelector('img');
    if (img) imageCell = img;

    // Second cell: title (as <strong>), description (text), all as array
    const textParts = [];
    // Title as <strong>
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textParts.push(strong);
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      if (textParts.length > 0) textParts.push(document.createElement('br'));
      textParts.push(document.createTextNode(descSpan.textContent.trim()));
    }
    rows.push([
      imageCell,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.parentElement.replaceWith(table);
}
