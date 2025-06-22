/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const cells = [['Cards (cards20)']];

  // Find the image list <ul>
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Get all card items (li)
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  items.forEach(item => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: The single <img> inside the image link (use reference, do not clone)
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: Title as <strong> and description as plain text
    const cellContent = [];
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span && span.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = span.textContent.trim();
        cellContent.push(strong);
      }
    }
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Add a <br> if title exists
      if (cellContent.length > 0) {
        cellContent.push(document.createElement('br'));
      }
      // Use text node for description
      cellContent.push(document.createTextNode(desc.textContent.trim()));
    }

    // Add the row to the table
    cells.push([
      imageCell,
      cellContent
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
