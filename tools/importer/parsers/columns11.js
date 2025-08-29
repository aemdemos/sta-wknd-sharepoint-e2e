/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: get all direct .aem-Grid .DIV children (columns)
  function getGrid(element) {
    return element.querySelector(
      '.aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--tablet--12, .aem-Grid.aem-Grid--default--12, .aem-Grid.aem-Grid--phone--12'
    );
  }

  // Find the main grid containing footer columns
  const grid = getGrid(element);
  if (!grid) return;

  // Get all immediate column children
  const cols = Array.from(grid.children).filter((child) => child.tagName === 'DIV');

  // Extract columns content:
  const logoDiv = cols.find(div => div.className.includes('cmp-image--logo'));
  const navDiv = cols.find(div => div.className.includes('cmp-navigation--footer'));
  const followDiv = cols.find(div => div.className.includes('cmp-title--right'));
  const socialDiv = cols.find(div => div.className.includes('cmp-buildingblock--btn-list'));
  const textDiv = cols.find(div => div.className.includes('cmp-text'));

  // Defensive extraction in case elements are missing
  const logoContent = logoDiv?.querySelector('.cmp-image') || '';
  const navContent = navDiv?.querySelector('.cmp-navigation') || '';
  // Combine Follow Us + Social buttons in one cell
  let followSocialContent = [];
  if (followDiv?.querySelector('.cmp-title')) followSocialContent.push(followDiv.querySelector('.cmp-title'));
  if (socialDiv) followSocialContent.push(socialDiv);
  if (followSocialContent.length === 0) followSocialContent = [''];
  const textContent = textDiv?.querySelector('.cmp-text') || '';

  // Build column content row - always three columns in this structure
  const columnsRow = [logoContent, navContent, followSocialContent];

  // Next row: copyright text info, single cell spanning full width
  // But table must have same number of columns as second row, so pad empty cells if needed
  const textRow = [textContent];
  while (textRow.length < columnsRow.length) textRow.push('');

  // Compose final table (header row is always a single cell array)
  const tableArr = [['Columns (columns11)'], columnsRow, textRow];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
