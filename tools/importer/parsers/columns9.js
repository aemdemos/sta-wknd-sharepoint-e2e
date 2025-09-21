/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the columns
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children columns of the grid
  const columns = Array.from(grid.children).filter(col =>
    col.classList.contains('aem-GridColumn') ||
    col.className.match(/aem-GridColumn--/)
  );

  // For each column, collect all its content (text, images, buttons, etc.)
  const columnsRow = columns.map(col => {
    // Collect all content including .cmp-text--font-xsmall
    const content = [];
    // If there's a .cmp-text--font-xsmall, include its content
    const textBlock = col.querySelector('.cmp-text--font-xsmall');
    if (textBlock) {
      content.push(textBlock.cloneNode(true));
    }
    // Collect all direct children except empty separators
    const cells = Array.from(col.children).filter(child => {
      if (child.classList && child.classList.contains('cmp-separator--hidden')) return false;
      // Exclude .cmp-text--font-xsmall since already handled above
      if (child.classList && child.classList.contains('cmp-text--font-xsmall')) return false;
      return true;
    });
    cells.forEach(c => content.push(c.cloneNode(true)));
    // If only one content item, use it directly
    if (content.length === 1) return content[0];
    // If multiple, wrap in a fragment
    const frag = document.createDocumentFragment();
    content.forEach(c => frag.appendChild(c));
    return frag;
  });

  // Compose the table rows
  const headerRow = ['Columns (columns9)'];
  const rows = [headerRow];
  if (columnsRow.length > 0) {
    rows.push(columnsRow);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
