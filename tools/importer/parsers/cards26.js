/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the example
  const headerRow = ['Cards (cards26)'];
  const rows = [];

  // Defensive: Only proceed if the list is present
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Get all immediate card items
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // IMAGE CELL: Find the <img> within cmp-image-list__item-image
    let imageEl = item.querySelector('.cmp-image-list__item-image img');
    // If for some reason the image is missing, fall back to empty cell
    let imageCell = imageEl || '';

    // TEXT CELL: Title (linked), description
    const content = item.querySelector('.cmp-image-list__item-content');
    const cellParts = [];

    // Title with link, styled as bold (since the example uses heading-like styling)
    let titleLink = content && content.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    if (titleLink && titleSpan) {
      // Use <strong> to simulate heading style, wrap in <a>
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleSpan.textContent;
      strong.appendChild(a);
      cellParts.push(strong);
    }

    // Description, if present
    let desc = content && content.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use a <div> for description to preserve block layout
      const div = document.createElement('div');
      div.textContent = desc.textContent;
      cellParts.push(div);
    }

    // If both are missing, fallback to empty string
    rows.push([imageCell, cellParts.length ? cellParts : '']);
  });

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
