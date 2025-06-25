/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the image element
  let img = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    img = imageDiv.querySelector('img');
  }

  // 2. Get the main content: title, description, CTA
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let title = null;
  let description = null;
  let cta = null;
  if (contentDiv) {
    title = contentDiv.querySelector('.cmp-teaser__title');
    description = contentDiv.querySelector('.cmp-teaser__description');
    cta = contentDiv.querySelector('.cmp-teaser__action-link');
  }

  // 3. Compose the block content cell
  const contentNodes = [];
  if (title) contentNodes.push(title);
  if (description) contentNodes.push(description);
  if (cta) contentNodes.push(cta);

  // 4. Compose the table: header row, image row, content row
  // Header must match exactly: 'Hero'
  const cells = [
    ['Hero'],
    [img || ''],
    [contentNodes]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
