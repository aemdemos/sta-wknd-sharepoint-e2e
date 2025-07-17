/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid inside the element (the actual columns container)
  function findDeepestGrid(el) {
    let candidate = null;
    let search = el;
    while (search) {
      const next = search.querySelector(':scope > div > div > div > div > div > div.aem-Grid');
      if (next) {
        candidate = next;
        search = next;
      } else {
        break;
      }
    }
    return candidate;
  }

  // 1. Find the columns grid
  const grid = findDeepestGrid(element);
  if (!grid) return;
  // 2. Find all its direct children that represent columns (ignore separators etc)
  let columns = Array.from(grid.children).filter(div => div.tagName === 'DIV');
  // Only keep columns with significant content
  columns = columns.filter(col => {
    // Ignore separators and empty columns
    if (col.querySelector('.cmp-separator')) return false;
    // Must have at least some content
    return col.textContent.trim() !== '' || col.querySelector('img,a,nav,.cmp-image,.cmp-title,.cmp-text,.xf-master-building-block');
  });

  // For each column, extract its main content container if there is only one (not separators etc), otherwise use the whole column
  const columnCells = columns.map(col => {
    // If column only has one main block, use it
    // Look for cmp-image, cmp-navigation, cmp-title, xf-master-building-block, cmp-text
    let main = col.querySelector('.cmp-image, nav.cmp-navigation, .cmp-title, .xf-master-building-block, .cmp-text');
    if (main && col.children.length === 1) {
      return main;
    }
    // If column contains only one main block along with decorative classes, use main
    if (main && Array.from(col.children).filter(x => x.nodeType === 1 && x.textContent.trim() !== '').length === 1) {
      return main;
    }
    // Otherwise, use the column div itself
    return col;
  });

  // Compose table: header is single cell, second row is one cell per column
  const headerRow = ['Columns (columns5)'];
  const contentRow = columnCells;

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
