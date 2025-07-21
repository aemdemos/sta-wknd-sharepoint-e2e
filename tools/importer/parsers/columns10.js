/* global WebImporter */
export default function parse(element, { document }) {
  // Find the topmost grid that contains the content columns
  let grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the footer columns and rows)
  const gridChildren = Array.from(grid.children);

  // Identify the key content areas
  const logoDiv = gridChildren.find(child => child.classList.contains('image'));
  const navigationDiv = gridChildren.find(child => child.classList.contains('navigation'));
  const titleDiv = gridChildren.find(child => child.classList.contains('title'));
  const socialDiv = gridChildren.find(child => child.classList.contains('buildingblock'));
  // All .text blocks in order
  const textDivs = gridChildren.filter(child => child.classList.contains('text'));

  // Header row: exactly one column as per the markdown example
  const headerRow = ['Columns (columns10)'];

  // Second row: three columns (logo, navigation, right panel with title + social)
  let logoContent = '';
  if (logoDiv) {
    const imgContainer = logoDiv.querySelector('[data-cmp-is="image"]');
    if (imgContainer) logoContent = imgContainer;
  }

  let navigationContent = '';
  if (navigationDiv) {
    const nav = navigationDiv.querySelector('nav');
    if (nav) navigationContent = nav;
  }

  let rightColContent = [];
  if (titleDiv) {
    const titleBlock = titleDiv.querySelector('.cmp-title');
    if (titleBlock) rightColContent.push(titleBlock);
  }
  if (socialDiv) {
    const socialGrid = socialDiv.querySelector('.aem-Grid');
    if (socialGrid) {
      rightColContent.push(...Array.from(socialGrid.children));
    }
  }
  if (rightColContent.length === 0) rightColContent = [''];

  // Second row: three columns
  const columnsRow = [logoContent, navigationContent, rightColContent];

  // Third row: single cell spanning all columns (all .text blocks as array)
  let textRowContent = [];
  textDivs.forEach(td => {
    const cmpText = td.querySelector('.cmp-text');
    textRowContent.push(cmpText || td);
  });
  if (textRowContent.length === 0) textRowContent = [''];

  // Build the final table data
  // The header row should only be a single-cell row, so we use one array of length 1
  // The content row should have three columns
  // The third row should be a single cell spanning the table width (just one array of length 1)
  const tableData = [
    headerRow,
    columnsRow,
    [textRowContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
