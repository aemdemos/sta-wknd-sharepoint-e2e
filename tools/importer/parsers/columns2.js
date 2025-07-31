/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container inside the header block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the 3 main direct children (logo/image, nav, search)
  // These might be in any order, but always one per 'column'
  const columns = [];
  grid.querySelectorAll(':scope > div').forEach((colDiv) => {
    // Only include columns that have actual relevant content
    // (ignore empty grid columns)
    if (
      colDiv.querySelector('.cmp-image--logo') ||
      colDiv.querySelector('nav.cmp-navigation') ||
      colDiv.querySelector('.cmp-search')
    ) {
      columns.push(colDiv);
    }
  });

  // Defensive: If for some reason not all 3 columns found, fallback to searching again
  if (columns.length < 3) {
    const logo = grid.querySelector('.cmp-image--logo')?.parentElement;
    const nav = grid.querySelector('nav.cmp-navigation')?.parentElement;
    const search = grid.querySelector('.cmp-search')?.parentElement;
    [logo, nav, search].forEach((col) => {
      if (col && !columns.includes(col)) columns.push(col);
    });
  }

  // Arrange the columns in order: logo (image), nav, search
  const logoDiv = columns.find(col => col.querySelector('.cmp-image--logo'));
  const navDiv = columns.find(col => col.querySelector('nav.cmp-navigation'));
  const searchDiv = columns.find(col => col.querySelector('.cmp-search'));
  const orderedCols = [logoDiv, navDiv, searchDiv].filter(Boolean);
  if (orderedCols.length === 0) return;
  // The header row should be a single cell matching the example EXACTLY
  const headerRow = ['Columns (columns2)'];
  const dataRow = orderedCols;

  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
