/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid inside the footer structure
  let mainGrid = null;
  const cmpContainers = element.querySelectorAll('.cmp-container');
  for (const cmpContainer of cmpContainers) {
    const grid = cmpContainer.querySelector('.aem-Grid');
    if (grid) {
      mainGrid = grid;
      break;
    }
  }
  if (!mainGrid) return;

  // Extract columns in visual order: logo+nav, follow+social, footer text
  // 1. Logo + navigation menu
  const col1 = [];
  const logoDiv = mainGrid.querySelector('.cmp-image--logo');
  if (logoDiv) {
    const logoBlock = logoDiv.querySelector('[data-cmp-is="image"]');
    if (logoBlock) col1.push(logoBlock);
  }
  const navDiv = mainGrid.querySelector('.cmp-navigation--footer');
  if (navDiv) {
    const navBlock = navDiv.querySelector('nav');
    if (navBlock) col1.push(navBlock);
  }

  // 2. Follow Us title and social icons
  const col2 = [];
  const titleDiv = mainGrid.querySelector('.cmp-title--right');
  if (titleDiv) {
    const titleBlock = titleDiv.querySelector('.cmp-title');
    if (titleBlock) col2.push(titleBlock);
  }
  const btnListDiv = mainGrid.querySelector('.cmp-buildingblock--btn-list');
  if (btnListDiv) {
    const btnGrid = btnListDiv.querySelector('.aem-Grid');
    if (btnGrid) {
      // add each .cmp-button directly
      btnGrid.querySelectorAll('.cmp-button').forEach(btn => col2.push(btn));
    }
  }

  // 3. All cmp-text blocks (bottom footer text)
  const col3 = [];
  mainGrid.querySelectorAll('.cmp-text').forEach(textBlock => col3.push(textBlock));

  // Build the table: first row = header (single cell!), then one row with 3 columns
  const headerRow = ['Columns (columns9)'];
  const dataRow = [col1, col2, col3];
  const rows = [headerRow, dataRow];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
