/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find the main grid container (usually only one direct child)
  const container = element.querySelector('.cmp-container');
  if (!container) return;
  const grid = container.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main columns: logo, navigation, search
  let logoCol = null, navCol = null, searchCol = null;
  const gridChildren = Array.from(grid.children);
  gridChildren.forEach((child) => {
    if (child.classList.contains('image')) logoCol = child;
    else if (child.classList.contains('navigation')) navCol = child;
    else if (child.classList.contains('search')) searchCol = child;
  });

  // Defensive: if any are missing, still proceed with available
  const columns = [];
  if (logoCol) columns.push(logoCol);
  if (navCol) columns.push(navCol);
  if (searchCol) columns.push(searchCol);

  // Table header
  const headerRow = ['Columns (columns2)'];

  // Only one row of columns (header + 1 row)
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
