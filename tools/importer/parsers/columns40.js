/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract columns: left is image, right is content
  const imageCol = element.querySelector('.cmp-teaser__image');
  const contentCol = element.querySelector('.cmp-teaser__content');

  // 2. Defensive: if either column missing, fallback to all children
  let columns;
  if (imageCol && contentCol) {
    columns = [imageCol, contentCol];
  } else {
    columns = Array.from(element.children);
  }

  // 3. Table header: must match block name exactly
  const headerRow = ['Columns (columns40)'];
  // 4. Table content row: reference existing elements
  const contentRow = columns;

  // 5. Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // 6. Replace original element
  element.replaceWith(table);
}
