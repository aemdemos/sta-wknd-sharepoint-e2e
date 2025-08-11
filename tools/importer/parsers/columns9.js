/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class
  function findDirectChildByClass(parent, cls) {
    return Array.from(parent.children).find(child => child.classList.contains(cls));
  }
  // Drill to deepest .aem-Grid
  let grid = null;
  let current = element;
  while (current) {
    grid = current.querySelector(':scope > .cmp-experiencefragment > .xf-content-height > .cmp-container > .container > .cmp-container > .container > .cmp-container > .aem-Grid');
    if (grid) break;
    grid = current.querySelector('.aem-Grid');
    if (grid) break;
    current = findDirectChildByClass(current, 'cmp-container') || current.querySelector('.container');
    if (!current || current === element) break;
  }
  if (!grid) return;
  // Get direct children
  const columns = Array.from(grid.children);
  // Extract blocks
  let logo = columns.find(col => col.classList.contains('image'));
  if (logo) logo = logo.querySelector('[data-cmp-is="image"]');
  let navigation = columns.find(col => col.classList.contains('navigation'));
  if (navigation) navigation = navigation.querySelector('nav');
  let title = columns.find(col => col.classList.contains('title'));
  if (title) title = title.querySelector('.cmp-title');
  let btnList = columns.find(col => col.classList.contains('buildingblock'));
  let btnItems = [];
  if (btnList) {
    const btnGrid = btnList.querySelector('.aem-Grid');
    if (btnGrid) {
      btnItems = Array.from(btnGrid.children);
    }
  }
  let text = columns.find(col => col.classList.contains('text'));
  if (text) text = text.querySelector('.cmp-text');
  // Compose table rows
  const headerRow = ['Columns (columns9)'];
  // 2nd row: left column logo+navigation, right column title+buttons
  const leftCol = [];
  if (logo) leftCol.push(logo);
  if (navigation) leftCol.push(navigation);
  const rightCol = [];
  if (title) rightCol.push(title);
  if (btnItems.length) rightCol.push(...btnItems);
  // 3rd row: left = text, right = text (for strict 2-col layout)
  // If text exists, place it in both columns for 2-col consistency,
  // or put empty string if not found
  const thirdRow = [text || '', text || ''];
  // Build and replace table
  const cells = [
    headerRow,
    [leftCol, rightCol],
    thirdRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
