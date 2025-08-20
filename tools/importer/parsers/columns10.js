/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the innermost .aem-Grid containing columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return; // nothing to do

  // Get all direct children of grid (each column content is a grid cell)
  const gridChildren = Array.from(grid.children || []);

  // Identify blocks by class name
  // logo: contains 'image', navigation: 'navigation', follow us title: 'title', social: 'buildingblock', copyright: 'text'
  let logoCol = null, navCol = null, titleCol = null, socialCol = null, copyrightCol = null;

  gridChildren.forEach(child => {
    const cls = child.className || '';
    if (!logoCol && cls.includes('image')) logoCol = child;
    else if (!navCol && cls.includes('navigation')) navCol = child;
    else if (!titleCol && cls.includes('title')) titleCol = child;
    else if (!socialCol && cls.includes('buildingblock')) socialCol = child;
    else if (!copyrightCol && cls.includes('text')) copyrightCol = child;
  });

  // Compose each column's content as in the screenshot and HTML
  // First col: logo and nav
  const col1 = [];
  if (logoCol) col1.push(logoCol);
  if (navCol) col1.push(navCol);
  // Second col: follow us and social
  const col2 = [];
  if (titleCol) col2.push(titleCol);
  if (socialCol) col2.push(socialCol);
  // Third col: copyright
  const col3 = [];
  if (copyrightCol) col3.push(copyrightCol);

  // Only add columns that are present
  const rowCols = [col1, col2, col3].filter(col => col.length > 0).map(col => col.length === 1 ? col[0] : col);

  // If all columns are missing, do not proceed
  if (rowCols.length === 0) return;

  // Always use required header as in example
  const headerRow = ['Columns (columns10)'];

  // Build the table: header + one row with all columns
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    rowCols
  ], document);

  element.replaceWith(block);
}
