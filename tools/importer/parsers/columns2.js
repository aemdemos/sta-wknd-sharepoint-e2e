/* global WebImporter */
export default function parse(element, { document }) {
  const cmpContainer = element.querySelector(':scope > .cmp-container');
  if (!cmpContainer) return;
  const aemGrid = cmpContainer.querySelector(':scope > .aem-Grid');
  if (!aemGrid) return;

  // Find direct children for the expected three columns
  const gridChildren = Array.from(aemGrid.querySelectorAll(':scope > div'));
  let logoDiv = null, navDiv = null, searchDiv = null;
  gridChildren.forEach(child => {
    if (child.classList.contains('image')) logoDiv = child;
    else if (child.classList.contains('navigation')) navDiv = child;
    else if (child.classList.contains('search')) searchDiv = child;
  });
  // Build column cells (always 3 columns)
  const columnsRow = [logoDiv || '', navDiv || '', (searchDiv ? (searchDiv.querySelector(':scope > section') || searchDiv) : '')];
  // The header row must be a single cell (not three!)
  const headerRow = ['Columns (columns2)'];
  // Output table structure: header row (1 col), content row (n cols)
  const tableArr = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
