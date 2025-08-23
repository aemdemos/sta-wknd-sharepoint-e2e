/* global WebImporter */
export default function parse(element, { document }) {
  // Table header with block name, as in the example
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Find the list container and all immediate card items
  const list = element.querySelector('ul');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li');

  items.forEach(item => {
    // First cell: the image element (reference the <img> directly)
    let img = item.querySelector('.cmp-image-list__item-image img');
    // Second cell: text content (title in <strong>, then description)
    let title = item.querySelector('.cmp-image-list__item-title');
    let desc = item.querySelector('.cmp-image-list__item-description');

    // We only reference existing elements from the DOM.
    // Title in <strong>, only if present
    let elements = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      elements.push(strong);
    }
    if (desc) {
      // Just reference the existing element, but as a <div> for consistency
      const div = document.createElement('div');
      div.textContent = desc.textContent.trim();
      elements.push(div);
    }
    cells.push([
      img || '',
      elements
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
