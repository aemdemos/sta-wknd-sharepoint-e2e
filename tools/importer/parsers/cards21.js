/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list
  const imagelist = element.querySelector('.cmp-image-list');
  if (!imagelist) return;
  const items = imagelist.querySelectorAll(':scope > li');
  const rows = [];
  // Header row
  rows.push(['Cards (cards21)']);
  items.forEach(item => {
    // Image cell: find the <img> inside the list item
    const img = item.querySelector('img');

    // Text cell: create a container for title and description
    const cellDiv = document.createElement('div');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (titleSpan) {
      // Use <strong> element for the title to match the heading style in markdown example
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      cellDiv.appendChild(strong);
    }
    if (descSpan) {
      if (titleSpan) {
        cellDiv.appendChild(document.createElement('br'));
      }
      // Description goes below the title
      cellDiv.appendChild(descSpan);
    }
    rows.push([img, cellDiv]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
