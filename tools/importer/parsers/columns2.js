/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid within the element
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find columns by their identifying classes
  let logoCol = null, navCol = null, searchCol = null;
  for (const child of grid.children) {
    if (child.classList.contains('image')) logoCol = child;
    else if (child.classList.contains('navigation')) navCol = child;
    else if (child.classList.contains('search')) searchCol = child;
  }

  // Extract the key content from each column
  // 1. Logo: use .cmp-image element
  let logoContent = logoCol ? logoCol.querySelector('.cmp-image') : null;

  // 2. Navigation: use the nav element
  let navContent = navCol ? navCol.querySelector('nav') : null;

  // 3. Search: use the section.cmp-search element
  let searchContent = searchCol ? searchCol.querySelector('section.cmp-search') : null;

  // Table header as specified for this block: single cell spanning all columns
  const headerRow = ['Columns (columns2)'];
  // Data row: only include non-null columns, in their respective order
  const dataRow = [];
  if (logoContent) dataRow.push(logoContent);
  if (navContent) dataRow.push(navContent);
  if (searchContent) dataRow.push(searchContent);

  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
