/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest content grid
  function findContentGrid(el) {
    // Look for the deepest .aem-Grid with .aem-Grid--12
    return el.querySelector('.aem-Grid.aem-Grid--12') || el;
  }

  // Get the deepest content grid within the element
  const grid = findContentGrid(element);
  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.querySelectorAll(':scope > div'));

  // Defensive: fallback if grid not found
  if (!columns.length) {
    // fallback: just use the whole element
    columns.push(element);
  }

  // Extract column content
  // Column 1: Logo
  const logoCol = columns.find(c => c.classList.contains('image'));
  let logoContent = null;
  if (logoCol) {
    logoContent = logoCol.querySelector('[data-cmp-is="image"]') || logoCol;
  }

  // Column 2: Navigation
  const navCol = columns.find(c => c.classList.contains('navigation'));
  let navContent = null;
  if (navCol) {
    navContent = navCol.querySelector('nav') || navCol;
  }

  // Column 3: Social/Follow Us
  const followTitleCol = columns.find(c => c.classList.contains('title'));
  let followTitle = null;
  if (followTitleCol) {
    followTitle = followTitleCol.querySelector('.cmp-title') || followTitleCol;
  }
  const btnListCol = columns.find(c => c.classList.contains('buildingblock'));
  let btnList = null;
  if (btnListCol) {
    btnList = btnListCol.querySelector('.aem-Grid') || btnListCol;
  }
  let followColContent = [];
  if (followTitle) followColContent.push(followTitle);
  if (btnList) followColContent.push(btnList);

  // Below columns: all text blocks (full width)
  const textBlocks = Array.from(grid.querySelectorAll('.text'));
  const separatorBlocks = Array.from(grid.querySelectorAll('.separator'));
  let belowContent = [];
  separatorBlocks.forEach(sep => {
    const hr = sep.querySelector('hr');
    if (hr) belowContent.push(hr);
  });
  textBlocks.forEach(tb => {
    const cmpText = tb.querySelector('.cmp-text') || tb;
    belowContent.push(cmpText);
  });

  // Fix: below row must have same number of columns as columnsRow, but no empty columns
  // Distribute belowContent evenly across three columns
  const numCols = 3;
  const belowRow = Array(numCols).fill(null);
  // If only one text block, put in first column; if multiple, distribute
  if (belowContent.length === 1) {
    belowRow[0] = belowContent[0];
  } else if (belowContent.length > 1) {
    // Try to group by logical paragraphs
    belowRow[0] = belowContent[0];
    belowRow[1] = belowContent.slice(1, Math.ceil(belowContent.length/2));
    belowRow[2] = belowContent.slice(Math.ceil(belowContent.length/2));
  }

  const headerRow = ['Columns (columns11)'];
  const columnsRow = [logoContent, navContent, followColContent];

  const cells = [
    headerRow,
    columnsRow,
    belowRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
