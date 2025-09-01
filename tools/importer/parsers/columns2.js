/* global WebImporter */
export default function parse(element, { document }) {
  // Find the aem-Grid within the provided element
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Gather the three columns, referencing existing child elements
  let logoCol = null, navCol = null, searchCol = null;
  for (const col of Array.from(grid.children)) {
    if (!logoCol && col.classList.contains('image')) logoCol = col;
    else if (!navCol && col.classList.contains('navigation')) navCol = col;
    else if (!searchCol && col.classList.contains('search')) searchCol = col;
  }
  // Build the content row
  const contentRow = [logoCol, navCol, searchCol];

  // Create the table body with only the contentRow
  const cells = [contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Create a header row with a single <th> and set colspan
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns2)';
  headerTh.setAttribute('colspan', String(contentRow.length));
  headerTr.appendChild(headerTh);
  block.insertBefore(headerTr, block.firstChild);

  // Replace the original element with the constructed block table
  element.replaceWith(block);
}
