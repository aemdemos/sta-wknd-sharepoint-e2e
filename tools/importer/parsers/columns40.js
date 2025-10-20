/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns40)'];

  // 2. Get the two main columns: image (left), content (right)
  // Defensive: Find the main cmp-teaser__image and cmp-teaser__content blocks
  let imageCol, contentCol;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    imageCol = teaser.querySelector('.cmp-teaser__image');
    contentCol = teaser.querySelector('.cmp-teaser__content');
  } else {
    // fallback: try direct children
    imageCol = element.querySelector('.cmp-teaser__image');
    contentCol = element.querySelector('.cmp-teaser__content');
  }

  // Defensive: If imageCol is a wrapper div, find the image inside
  if (imageCol && imageCol.children.length === 1 && imageCol.firstElementChild.classList.contains('cmp-image')) {
    imageCol = imageCol.firstElementChild;
  }

  // 3. Build the content row: [image, content]
  const contentRow = [imageCol, contentCol];

  // 4. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
