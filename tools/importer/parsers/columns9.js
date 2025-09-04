/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // We'll collect the three main columns: logo, navigation, follow-us/buttons
  let logoCol = null;
  let navCol = null;
  let followCol = null;

  // Defensive: find by class names
  columns.forEach(col => {
    if (col.classList.contains('image')) {
      logoCol = col;
    } else if (col.classList.contains('navigation')) {
      navCol = col;
    } else if (col.classList.contains('title')) {
      followCol = col;
    }
  });

  // The social buttons are in a separate column after the title
  let btnListCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));

  // The copyright text is in a column with class 'text'
  let textCol = columns.find(col => col.classList.contains('text'));

  // Compose the first row: logo, nav, follow+buttons
  // For the follow+buttons, combine the title and the button list
  let followCell = [];
  if (followCol) followCell.push(followCol);
  if (btnListCol) followCell.push(btnListCol);

  // Compose the columns row
  const columnsRow = [
    logoCol || '',
    navCol || '',
    followCell.length ? followCell : '',
  ];

  // Compose the copyright row (spanning all columns)
  const copyrightRow = [textCol || ''];

  // Build the table: header, columns, copyright
  const headerRow = ['Columns (columns9)'];
  const tableRows = [
    headerRow,
    columnsRow,
    copyrightRow,
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
