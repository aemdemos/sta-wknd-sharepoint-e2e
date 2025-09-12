/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the footer columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children).filter((col) => {
    // Only keep columns that are not separators or empty
    if (col.classList.contains('cmp-separator--hidden')) return false;
    return true;
  });

  // There are always 3 columns visually: logo/nav, follow us/buttons, copyright
  // But the structure is: [logo], [navigation], [title], [buttons], [copyright]
  // We'll group as:
  // 1st column: logo + navigation
  // 2nd column: follow us title + buttons
  // 3rd column: copyright text

  // Find logo (image)
  const logoCol = columns.find(col => col.querySelector('.cmp-image'));
  // Find navigation
  const navCol = columns.find(col => col.querySelector('.cmp-navigation'));
  // Find follow us title
  const followTitleCol = columns.find(col => col.querySelector('.cmp-title'));
  // Find buttons
  const buttonsCol = columns.find(col => col.querySelector('.cmp-buildingblock--btn-list'));
  // Find copyright text
  const textCol = columns.find(col => col.querySelector('.cmp-text'));

  // Compose column 1: logo + navigation
  const col1Content = [];
  if (logoCol) col1Content.push(...logoCol.childNodes);
  if (navCol) col1Content.push(...navCol.childNodes);

  // Compose column 2: follow us title + buttons
  const col2Content = [];
  if (followTitleCol) col2Content.push(...followTitleCol.childNodes);
  if (buttonsCol) col2Content.push(...buttonsCol.childNodes);

  // Compose column 3: copyright text
  const col3Content = [];
  if (textCol) col3Content.push(...textCol.childNodes);

  // Build the table
  const headerRow = ['Columns (columns10)'];
  const contentRow = [col1Content, col2Content, col3Content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
