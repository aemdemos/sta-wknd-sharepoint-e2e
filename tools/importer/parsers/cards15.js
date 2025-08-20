/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all direct card items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Image (first img)
    const img = item.querySelector('img');

    // Title: get the <span> (text), reference link if present
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    let titleElement = null;
    if (titleSpan) {
      titleElement = document.createElement('strong');
      titleElement.textContent = titleSpan.textContent;
    }
    let titleContent = titleElement;
    if (titleLink && titleElement) {
      // Use the original link, but replace its text with the strong
      const linkElem = titleLink;
      while (linkElem.firstChild) linkElem.removeChild(linkElem.firstChild);
      linkElem.appendChild(titleElement);
      titleContent = linkElem;
    }

    // Description
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');
    const descContent = descriptionSpan || '';

    // Compose cell content
    const cellContent = [];
    if (titleContent) cellContent.push(titleContent);
    if (descContent) cellContent.push(descContent);

    // Add each card row: image left, content right
    rows.push([
      img || '',
      cellContent.length ? cellContent : ['']
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
