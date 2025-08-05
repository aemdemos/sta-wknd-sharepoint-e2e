/* global WebImporter */
export default function parse(element, { document }) {
  // Get the relevant columns: image and content
  const imageCol = element.querySelector('.cmp-teaser__image') || document.createElement('div');
  const contentCol = element.querySelector('.cmp-teaser__content') || document.createElement('div');

  // Must have a header row with only one cell, to be rendered as a th with colspan=2 by WebImporter
  const headerRow = ['Columns (columns40)'];
  // The content row: two columns, image first, then content
  const contentRow = [imageCol, contentCol];

  const cells = [headerRow, contentRow];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
