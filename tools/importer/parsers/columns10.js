/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing columns
  let grid = element.querySelector('.cmp-layout-container--footer .aem-Grid');
  if (!grid) {
    grid = element.querySelector('.aem-Grid');
  }

  // Gather column elements: logo image, navigation, follow-us title, button list
  let columns = [];
  if (grid) {
    const gridChildren = Array.from(grid.children).filter(child => (
      child.classList.contains('image') ||
      child.classList.contains('navigation') ||
      child.classList.contains('title') ||
      child.classList.contains('buildingblock')
    ));
    gridChildren.forEach(child => {
      if (child.classList.contains('buildingblock')) {
        const btnGrid = child.querySelector('.aem-Grid');
        columns.push(btnGrid ? btnGrid : child);
      } else {
        columns.push(child);
      }
    });
  }
  if (columns.length === 0) return;

  // Find the footer text section
  const textSection = element.querySelector('.text .cmp-text');

  // Build table rows: header must be a single cell
  const rows = [];
  rows.push(['Columns (columns10)']);
  rows.push(columns);
  if (textSection) {
    // Text only in the first column, empty for rest
    const textRow = [textSection];
    for (let i = 1; i < columns.length; i++) {
      textRow.push('');
    }
    rows.push(textRow);
  }

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
