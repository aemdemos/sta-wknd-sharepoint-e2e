/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns content
  const mainGrid = element.querySelector(':scope > div > div');
  const gridChildren = mainGrid ? Array.from(mainGrid.children) : [];

  // 1st column: Article content
  let leftCol = gridChildren.find(child =>
    child.tagName === 'MAIN' && child.querySelector('article.contentfragment')
  );
  if (!leftCol) leftCol = gridChildren[2];

  // 2nd column: Hero image
  let centerCol = gridChildren.find(child => child.classList.contains('image'));
  if (!centerCol) centerCol = gridChildren[0];

  // 3rd column: Sidebar/aside
  const aside = element.querySelector('aside.container');
  let rightCol = null;
  if (aside) {
    const asideGrid = aside.querySelector(':scope > div > div');
    rightCol = asideGrid || aside;
  }

  // Build table manually for correct header row structure
  const table = document.createElement('table');

  // Header row: exactly one <th>, with colspan=3
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns33)';
  headerTh.colSpan = 3;
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row (3 columns)
  const contentTr = document.createElement('tr');
  [leftCol, centerCol, rightCol].forEach(cell => {
    const td = document.createElement('td');
    if (cell) td.appendChild(cell);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
