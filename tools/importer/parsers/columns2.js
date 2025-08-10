/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the grid layout containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // The columns in the grid are: logo/image, navigation, search
  // They may not always be in the same order, so we find them by class
  const logoCol = Array.from(grid.children).find(el => el.classList.contains('image'));
  const navCol = Array.from(grid.children).find(el => el.classList.contains('navigation'));
  const searchCol = Array.from(grid.children).find(el => el.classList.contains('search'));

  // Extract the content blocks from each column
  // Reference the existing elements directly (do not clone)
  const logoBlock = logoCol ? logoCol.firstElementChild : '';
  const navBlock = navCol ? navCol.firstElementChild : '';
  const searchBlock = searchCol ? searchCol.firstElementChild : '';

  // Prepare the table rows
  // The header row must be a single cell, but we need it to span all columns
  // So we'll create the table, then set colspan in the actual DOM after creation
  const headerText = 'Columns (columns2)';
  const contentRow = [logoBlock, navBlock, searchBlock];

  const table = WebImporter.DOMUtils.createTable([
    [headerText],
    contentRow
  ], document);

  // Set the colspan on the <th> cell of the header row to span all columns
  const headerTh = table.querySelector('tr:first-child th');
  if (headerTh) {
    headerTh.setAttribute('colspan', contentRow.length);
  }

  // Replace the original element
  element.replaceWith(table);
}
