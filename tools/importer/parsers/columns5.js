/* global WebImporter */
export default function parse(element, { document }) {
  // Identify the innermost grid containing the footer's main content
  let footerGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (let i = grids.length - 1; i >= 0; i--) {
    const grid = grids[i];
    // Heuristic: look for logo + nav together
    if (grid.querySelector('.cmp-image--logo') && grid.querySelector('.cmp-navigation--footer')) {
      footerGrid = grid;
      break;
    }
  }
  if (!footerGrid) {
    footerGrid = element.querySelector('.aem-Grid');
  }

  // 1st Column: Logo (image block) and Navigation (footer nav)
  const logo = footerGrid.querySelector('.cmp-image--logo');
  const navigation = footerGrid.querySelector('.cmp-navigation--footer');
  const leftCol = document.createElement('div');
  if (logo) leftCol.appendChild(logo);
  if (navigation) leftCol.appendChild(navigation);

  // 2nd Column: Follow Us title and Social Buttons block
  const title = footerGrid.querySelector('.cmp-title');
  // Only get the title element if it is relevant (often redundant)
  const btnBlock = footerGrid.querySelector('.cmp-buildingblock--btn-list');
  const socialCol = document.createElement('div');
  if (title) socialCol.appendChild(title);
  if (btnBlock) socialCol.appendChild(btnBlock);

  // Copyright text (always present, single block)
  const copyrightBlock = footerGrid.querySelector('.cmp-text');
  let copyrightCol = '';
  if (copyrightBlock) {
    copyrightCol = document.createElement('div');
    copyrightCol.appendChild(copyrightBlock);
  }

  // Compose table
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftCol, socialCol];

  // Construct the table rows
  let cells = [headerRow, contentRow];
  // Add copyright row as a single row, spans two columns
  if (copyrightCol) {
    cells.push([copyrightCol, '']);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
