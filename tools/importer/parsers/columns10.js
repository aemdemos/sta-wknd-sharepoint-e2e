/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .aem-Grid with the most direct children
  function findMainGrid(el) {
    const grids = Array.from(el.querySelectorAll('.aem-Grid'));
    if (!grids.length) return el;
    return grids.sort((a, b) => b.children.length - a.children.length)[0];
  }

  const grid = findMainGrid(element);

  // Filter out clear non-content (like separators)
  const contentColumns = Array.from(grid.children).filter(child => {
    if (child.classList.contains('cmp-separator')) return false;
    if (!child.textContent.trim() && !child.querySelector('img,a,svg')) return false;
    return true;
  });

  // Extract the main content for each column
  function extractMainContentBlock(col) {
    let sel = '.cmp-image,.cmp-navigation,.cmp-title,.cmp-buildingblock,.cmp-text';
    const main = col.querySelector(sel);
    if (main) return main;
    const innerGrid = col.querySelector('.aem-Grid');
    if (innerGrid) {
      const children = Array.from(innerGrid.children).filter(c => c.textContent.trim() || c.querySelector('img,a,svg'));
      if (children.length === 1) return children[0];
      if (children.length > 1) return children;
    }
    return col;
  }

  // Build the data row for the columns
  const columnsRow = contentColumns.map(extractMainContentBlock);

  // Find legal/footer text (.cmp-text not already included)
  let footerText = null;
  const allTextBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  if (allTextBlocks.length > 0) {
    const lastText = allTextBlocks[allTextBlocks.length - 1];
    let alreadyIncluded = columnsRow.some(c => c === lastText || (Array.isArray(c) && c.includes(lastText)));
    if (!alreadyIncluded) {
      footerText = lastText;
    }
  }

  // Build cells: header is always a single column, data row is N columns, footer row if present is N columns (with first cell as text, rest empty)
  const cells = [];
  cells.push(['Columns (columns10)']);
  if (columnsRow.length > 0) cells.push(columnsRow);
  if (footerText) {
    // pad footer row to match column count
    const pad = Array(columnsRow.length - 1).fill('');
    cells.push([footerText, ...pad]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
