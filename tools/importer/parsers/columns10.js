/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid (footer content)
  const grids = element.querySelectorAll('.aem-Grid');
  const grid = grids[grids.length - 1] || element;
  const columns = Array.from(grid.children);

  // Helper to get a column by class
  function findByClass(cls) {
    return columns.find((el) => el.classList.contains(cls));
  }

  // Column 1: Logo (as <a> if present, else <img>)
  let logoCell = '';
  const imageCol = findByClass('image');
  if (imageCol) {
    const logoLink = imageCol.querySelector('a');
    if (logoLink) {
      logoCell = logoLink.cloneNode(true);
    } else {
      const logoImg = imageCol.querySelector('img');
      if (logoImg) logoCell = logoImg.cloneNode(true);
    }
  }

  // Column 2: Navigation (nav)
  let navCell = '';
  const navCol = findByClass('navigation');
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navCell = nav.cloneNode(true);
  }

  // Column 3: Follow Us (title + social buttons)
  let followCell = '';
  const titleCol = findByClass('title');
  const btnListCol = findByClass('buildingblock');
  const frag = document.createElement('div');
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title) frag.appendChild(title.cloneNode(true));
  }
  if (btnListCol) {
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    if (btnGrid) {
      Array.from(btnGrid.children).forEach((btn) => {
        frag.appendChild(btn.cloneNode(true));
      });
    }
  }
  if (frag.childNodes.length) followCell = frag;

  // Footer text: combine all .text columns
  const textCols = columns.filter((el) => el.classList.contains('text'));
  let textCell = '';
  if (textCols.length) {
    const textFrag = document.createElement('div');
    textCols.forEach((el) => {
      const cmpText = el.querySelector('.cmp-text');
      if (cmpText) {
        Array.from(cmpText.childNodes).forEach((n) => textFrag.appendChild(n.cloneNode(true)));
      }
    });
    if (textFrag.childNodes.length) textCell = textFrag;
  }

  // Only include columns that have content
  const columnsRow = [logoCell, navCell, followCell].filter(cell => cell && (typeof cell !== 'string' || cell.textContent.trim() !== ''));

  // If there is footer text, add it as a new row with the same number of columns, putting text in the first cell
  const headerRow = ['Columns (columns10)'];
  const cells = [headerRow];
  if (columnsRow.length) cells.push(columnsRow);
  if (textCell && columnsRow.length) {
    // Fill the rest of the row with empty strings
    const textRow = [textCell];
    while (textRow.length < columnsRow.length) textRow.push('');
    cells.push(textRow);
  }

  // Always output the block, even if only header
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
