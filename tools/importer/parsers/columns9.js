/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid structure with columns
  let mainGrid;
  const grids = element.querySelectorAll('.aem-Grid');
  mainGrid = Array.from(grids).sort((a, b) => b.children.length - a.children.length)[0];
  if (!mainGrid) {
    return;
  }
  // Extract logo image
  const logoDiv = mainGrid.querySelector('.image');
  let logoWrap = null;
  if (logoDiv) {
    logoWrap = logoDiv.querySelector('[data-cmp-is="image"]');
  }
  // Extract navigation
  const navDiv = mainGrid.querySelector('.navigation');
  let nav = null;
  if (navDiv) {
    nav = navDiv.querySelector('nav');
  }
  // Extract "Follow Us" title
  const titleDiv = mainGrid.querySelector('.title');
  let title = null;
  if (titleDiv) {
    title = titleDiv.querySelector('.cmp-title');
  }
  // Extract social buttons
  const socialBlock = mainGrid.querySelector('.buildingblock');
  // Extract copyright/text
  const textBlock = mainGrid.querySelector('.text');
  let copyrightDiv = null;
  if (textBlock) {
    copyrightDiv = textBlock.querySelector('.cmp-text');
  }
  // Build columns:
  // Column 1: logo image
  // Column 2: navigation
  // Column 3: follow title + social
  let col1 = [];
  if (logoWrap) col1.push(logoWrap);
  let col2 = [];
  if (nav) col2.push(nav);
  let col3 = [];
  if (title) col3.push(title);
  if (socialBlock) col3.push(socialBlock);
  // Only keep columns that have content
  let cols = [col1, col2, col3].filter(col => col.length);
  const columnsCount = cols.length;
  // Content row
  const contentRow = cols.map((col) => col.length === 1 ? col[0] : col);
  // Copyright row: copyright text in first cell, empty others
  const copyrightRow = [copyrightDiv ? copyrightDiv : ''];
  for (let i = 1; i < columnsCount; i++) copyrightRow.push('');

  // Create table with header cell spanning all columns
  const table = document.createElement('table');
  // Header row with colspan
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.innerHTML = 'Columns (columns9)';
  if (columnsCount > 1) {
    th.setAttribute('colspan', columnsCount);
  }
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Content row
  const trContent = document.createElement('tr');
  contentRow.forEach(cell => {
    const td = document.createElement('td');
    if (typeof cell === 'string') {
      td.innerHTML = cell;
    } else if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (cell) {
      td.append(cell);
    }
    trContent.appendChild(td);
  });
  table.appendChild(trContent);
  // Copyright row
  const trCopyright = document.createElement('tr');
  copyrightRow.forEach(cell => {
    const td = document.createElement('td');
    if (typeof cell === 'string') {
      td.innerHTML = cell;
    } else if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (cell) {
      td.append(cell);
    }
    trCopyright.appendChild(td);
  });
  table.appendChild(trCopyright);
  // Replace element
  element.replaceWith(table);
}
