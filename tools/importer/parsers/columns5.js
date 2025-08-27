/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the innermost footer grid with the content columns
  function getFooterGrid(footerEl) {
    // find the deepest .aem-Grid.aem-Grid--12 (should have all content in columns)
    let grids = footerEl.querySelectorAll('.aem-Grid.aem-Grid--12');
    return grids[grids.length - 1] || null;
  }

  // Find the footer grid
  const grid = getFooterGrid(element);
  if (!grid) return;
  const footerChildren = Array.from(grid.children);

  // Find key column elements by classes
  let logoCol = null, navCol = null, titleCol = null, btnListCol = null, textCols = [];
  footerChildren.forEach(child => {
    const cls = child.className;
    if (!logoCol && cls.includes('cmp-image')) {
      logoCol = child;
    } else if (!navCol && cls.includes('cmp-navigation')) {
      navCol = child;
    } else if (!titleCol && cls.includes('cmp-title')) {
      titleCol = child;
    } else if (!btnListCol && cls.includes('cmp-buildingblock--btn-list')) {
      btnListCol = child;
    } else if (cls.includes('cmp-text')) {
      textCols.push(child);
    }
  });

  // Compose first content row, referencing existing elements only
  // Left: logo + nav, Right: title + buttons (social)
  const leftCol = document.createElement('div');
  if (logoCol) leftCol.appendChild(logoCol);
  if (navCol) leftCol.appendChild(navCol);

  const rightCol = document.createElement('div');
  if (titleCol) rightCol.appendChild(titleCol);
  if (btnListCol) rightCol.appendChild(btnListCol);

  // Compose second row if there are text blocks
  // We expect two text blocks, both should be included, even if one is missing
  const row2 = [];
  row2[0] = textCols[0] || '';
  row2[1] = textCols[1] || '';

  const cells = [
    ['Columns (columns5)'],
    [leftCol, rightCol],
    row2,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
