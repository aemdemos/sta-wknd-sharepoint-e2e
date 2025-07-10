/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the columns: content and image
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // Header row: single cell as in the markdown example
  const headerRow = ['Columns (columns40)'];

  // Body row: as many columns as present in the block (content, image, etc.)
  const bodyRow = [];
  if (contentDiv) bodyRow.push(contentDiv);
  if (imageDiv) bodyRow.push(imageDiv);

  // Must always produce single cell in header row, then N columns following
  const cells = [headerRow, bodyRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
