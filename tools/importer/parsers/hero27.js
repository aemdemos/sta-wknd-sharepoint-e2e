/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero27)'];

  // Find the image element
  const img = element.querySelector('.cmp-teaser__image img');
  const imageRow = [img ? img : ''];

  // Find the content elements
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentRowContent = [];
  if (contentDiv) {
    // Title
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentRowContent.push(title);
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentRowContent.push(desc);
    // CTA
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentRowContent.push(cta);
  }
  // If only one element, don't wrap in array
  const contentRow = [contentRowContent.length === 1 ? contentRowContent[0] : contentRowContent];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with table
  element.replaceWith(table);
}
