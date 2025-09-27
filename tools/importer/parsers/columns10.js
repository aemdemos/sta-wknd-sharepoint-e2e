/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest grid container
  function findGrid(el) {
    let grid = null;
    el.querySelectorAll('.aem-Grid').forEach((g) => {
      if (!grid || grid.contains(g)) grid = g;
    });
    return grid;
  }

  // Find the deepest grid for layout
  const grid = findGrid(element);
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // 1. Logo (image)
  const logoDiv = gridChildren.find((div) => div.classList.contains('image'));
  let logoContent = null;
  if (logoDiv) {
    const cmpImage = logoDiv.querySelector('.cmp-image');
    if (cmpImage) logoContent = cmpImage.cloneNode(true);
    else logoContent = logoDiv.cloneNode(true);
  }

  // 2. Navigation (nav)
  const navDiv = gridChildren.find((div) => div.classList.contains('navigation'));
  let navContent = null;
  if (navDiv) {
    const nav = navDiv.querySelector('nav');
    if (nav) navContent = nav.cloneNode(true);
    else navContent = navDiv.cloneNode(true);
  }

  // 3. Follow Us title
  const titleDiv = gridChildren.find((div) => div.classList.contains('title'));
  let titleContent = null;
  if (titleDiv) {
    const cmpTitle = titleDiv.querySelector('.cmp-title');
    if (cmpTitle) titleContent = cmpTitle.cloneNode(true);
    else titleContent = titleDiv.cloneNode(true);
  }

  // 4. Social buttons (buildingblock)
  const btnDiv = gridChildren.find((div) => div.classList.contains('buildingblock'));
  let btnContent = null;
  if (btnDiv) {
    const btnGrid = btnDiv.querySelector('.aem-Grid');
    if (btnGrid) btnContent = btnGrid.cloneNode(true);
    else btnContent = btnDiv.cloneNode(true);
  }

  // 5. Separator (hr)
  const sepDiv = gridChildren.find((div) => div.classList.contains('separator'));
  let sepContent = null;
  if (sepDiv) {
    const hr = sepDiv.querySelector('hr');
    if (hr) sepContent = hr.cloneNode(true);
    else sepContent = sepDiv.cloneNode(true);
  }

  // 6. Footer text
  const textDiv = gridChildren.find((div) => div.classList.contains('text'));
  let textContent = null;
  if (textDiv) {
    const cmpText = textDiv.querySelector('.cmp-text');
    if (cmpText) textContent = cmpText.cloneNode(true);
    else textContent = textDiv.cloneNode(true);
  }

  // Compose the columns visually as in the screenshots:
  // There are 3 columns: [Logo], [Navigation], [Follow Us + Social]
  // The separator and footer text should be merged into the third column (rightmost)
  let followUsCell = [];
  if (titleContent) followUsCell.push(titleContent);
  if (btnContent) followUsCell.push(btnContent);
  if (sepContent) followUsCell.push(sepContent);
  if (textContent) followUsCell.push(textContent);

  // Only add columns that have actual content
  const columns = [];
  if (logoContent) columns.push(logoContent);
  if (navContent) columns.push(navContent);
  if (followUsCell.length) columns.push(followUsCell);

  // Header row
  const headerRow = ['Columns (columns10)'];

  // All rows after header must have the same number of columns as the first content row
  if (columns.length === 0) return;
  const firstRow = columns;

  // Build the table
  const cells = [
    headerRow,
    firstRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
