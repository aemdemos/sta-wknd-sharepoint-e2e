/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main left column (main article content)
  let mainColumn = null;
  const mainCandidates = element.querySelectorAll('main.container');
  for (const cand of mainCandidates) {
    if (
      cand.querySelector('.cmp-container .title .cmp-title__text') &&
      cand.querySelector('.cmp-container article.contentfragment')
    ) {
      mainColumn = cand.querySelector('.cmp-container');
      break;
    }
  }
  if (!mainColumn) {
    mainColumn = element.querySelector('main.container .cmp-container');
  }
  if (mainColumn) {
    const breadcrumbs = mainColumn.querySelectorAll('nav.cmp-breadcrumb');
    breadcrumbs.forEach(bc => bc.remove());
  }

  // Get the sidebar right column
  let sidebarColumn = null;
  const aside = element.querySelector('aside.container');
  if (aside) {
    sidebarColumn = aside.querySelector('.cmp-container') ? aside.querySelector('.cmp-container') : aside;
  }

  // Correct table rows: header is one cell, content row has two cells
  // WebImporter.DOMUtils.createTable expects each row as an array, and will use the number of cells in the first row (header) to determine columns for all rows.
  // To force the header row to have one cell and the content row to have two, we must create the table manually and not use createTable.
  // ---
  // So we must build the table ourselves:
  const table = document.createElement('table');

  // Header row: one cell, with colspan for subsequent content row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns16)';
  th.colSpan = 2;
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Content row: two cells
  const trContent = document.createElement('tr');
  const td1 = document.createElement('td');
  if (mainColumn) td1.appendChild(mainColumn);
  const td2 = document.createElement('td');
  if (sidebarColumn) td2.appendChild(sidebarColumn);
  trContent.appendChild(td1);
  trContent.appendChild(td2);
  table.appendChild(trContent);

  element.replaceWith(table);
}
