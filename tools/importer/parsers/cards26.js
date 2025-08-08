/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate card items (li)
  const list = element.querySelector('ul.cmp-image-list');
  const items = list ? Array.from(list.children) : [];

  // Build the rows
  const rows = items.map((li) => {
    const content = li.querySelector('article.cmp-image-list__item-content');
    if (!content) return null;
    // Image
    const img = content.querySelector('.cmp-image-list__item-image-link img');
    // Title (as strong)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const strong = titleSpan ? document.createElement('strong') : null;
    if (strong) strong.textContent = titleSpan.textContent.trim();
    // Description
    const descriptionSpan = content.querySelector('.cmp-image-list__item-description');
    const descDiv = descriptionSpan ? document.createElement('div') : null;
    if (descDiv) descDiv.textContent = descriptionSpan.textContent.trim();
    const textElems = [];
    if (strong) textElems.push(strong);
    if (descDiv) textElems.push(descDiv);
    return [img, textElems];
  }).filter(Boolean);

  // Create the header row as a single cell that will visually span both columns
  // WebImporter.DOMUtils.createTable does not support colspan, so provide a single array of length 1 for header row
  // and two columns for data rows, which matches the example block structure
  const cells = [
    ['Cards (cards26)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Manually set colspan=2 on the header row th
  const th = table.querySelector('tr:first-child > th');
  if (th) th.setAttribute('colspan', '2');

  element.replaceWith(table);
}
