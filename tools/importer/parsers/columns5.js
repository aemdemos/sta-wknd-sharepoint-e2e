/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid inside the footer
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children (columns and possible text/separator blocks)
  const gridChildren = Array.from(grid.children);

  // Prepare columns: logo image, navigation, title, social block
  // Identify them by searching for unique classes inside
  const logoCol = gridChildren.find(col => col.querySelector('.cmp-image')) || '';
  const navCol = gridChildren.find(col => col.querySelector('.cmp-navigation')) || '';
  const titleCol = gridChildren.find(col => col.querySelector('.cmp-title')) || '';
  const socialCol = gridChildren.find(col => col.querySelector('.cmp-buildingblock--btn-list')) || gridChildren.find(col => col.querySelector('.cmp-button')) || '';

  // Build the columns array in the order: logo, nav, title, social
  const colBlocks = [logoCol, navCol, titleCol, socialCol];

  // Get all text blocks after the columns (footer description and copyright)
  const textBlocks = gridChildren.filter(col => (col.className || '').includes('cmp-text--font-xsmall'));
  // Combine both text blocks into a single container
  let textCell = '';
  if (textBlocks.length) {
    const textCellDiv = document.createElement('div');
    textBlocks.forEach(tb => {
      const inner = tb.querySelector('div');
      if (inner) textCellDiv.appendChild(inner);
    });
    textCell = textCellDiv;
  }

  // Build the table manually so header row has exactly one column
  const table = document.createElement('table');

  // Header row (exactly one <th>)
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns5)';
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Second row: content columns (always 4)
  const contentTr = document.createElement('tr');
  colBlocks.forEach(cell => {
    const td = document.createElement('td');
    if (typeof cell === 'string') {
      td.innerHTML = cell;
    } else if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (cell) {
      td.append(cell);
    }
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  // Third row: text block in first column, rest empty
  const textTr = document.createElement('tr');
  const textTd = document.createElement('td');
  if (typeof textCell === 'string') {
    textTd.innerHTML = textCell;
  } else if (Array.isArray(textCell)) {
    textTd.append(...textCell);
  } else if (textCell) {
    textTd.append(textCell);
  }
  textTr.appendChild(textTd);
  // pad with empty tds to match number of columns
  for (let i = 1; i < colBlocks.length; i++) {
    textTr.appendChild(document.createElement('td'));
  }
  table.appendChild(textTr);

  element.replaceWith(table);
}
