/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the two main columns: content and image
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Build the table rows
  // The first row must be a single header cell, but must span two columns
  // WebImporter.DOMUtils.createTable doesn't set colspan, so we patch it afterward
  const cells = [
    ['Columns (columns40)'],
    [teaserContent || '', teaserImage || '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header's colspan to span both columns
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
