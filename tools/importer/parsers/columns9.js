/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest .aem-Grid with .aem-GridColumn children
  function findDeepestGridWithColumns(root) {
    let current = root;
    let lastGrid = null;
    while (true) {
      const nextGrid = current.querySelector(':scope > .aem-Grid');
      if (!nextGrid) break;
      lastGrid = nextGrid;
      current = nextGrid;
    }
    return lastGrid || root;
  }

  // Get all direct children that are .aem-GridColumn
  function getGridColumns(grid) {
    return Array.from(grid.children).filter(child =>
      child.classList && Array.from(child.classList).some(cl => cl.startsWith('aem-GridColumn'))
    );
  }

  // Step 1: Find the main columns container
  const grid = findDeepestGridWithColumns(element);
  const columns = getGridColumns(grid);

  // Step 2: Identify and collect the relevant column blocks
  let logoBlock = null;
  let navBlock = null;
  let socialBlock = null;
  let textBlock = null;
  let foundTitle = null;
  let foundBtnList = null;

  columns.forEach(col => {
    if (!logoBlock && col.querySelector('.cmp-image')) {
      logoBlock = col.querySelector('.cmp-image');
    }
    if (!navBlock && col.querySelector('nav.cmp-navigation')) {
      navBlock = col.querySelector('nav.cmp-navigation');
    }
    if (!foundTitle && col.querySelector('.cmp-title')) {
      foundTitle = col.querySelector('.cmp-title');
    }
    if (!foundBtnList && (col.querySelector('.xf-master-building-block') || col.querySelector('.aem-Grid'))) {
      foundBtnList = col.querySelector('.xf-master-building-block') || col.querySelector('.aem-Grid');
    }
    if (!textBlock && col.querySelector('.cmp-text')) {
      textBlock = col.querySelector('.cmp-text');
    }
  });

  // Compose the social block: if both title and btn list exist, put both in a wrapper for the cell
  if (foundTitle && foundBtnList) {
    socialBlock = document.createElement('div');
    socialBlock.appendChild(foundTitle);
    socialBlock.appendChild(foundBtnList);
  } else if (foundTitle || foundBtnList) {
    socialBlock = foundTitle || foundBtnList;
  }

  // If any block is still missing, try searching grid as a fallback
  if (!logoBlock) logoBlock = grid.querySelector('.cmp-image');
  if (!navBlock) navBlock = grid.querySelector('nav.cmp-navigation');
  if (!socialBlock) {
    const t = grid.querySelector('.cmp-title');
    const b = grid.querySelector('.xf-master-building-block') || grid.querySelector('.aem-Grid');
    if (t && b) {
      socialBlock = document.createElement('div');
      socialBlock.appendChild(t);
      socialBlock.appendChild(b);
    } else if (t || b) {
      socialBlock = t || b;
    }
  }
  if (!textBlock) textBlock = grid.querySelector('.cmp-text');

  // Fix: Header row must be a single cell array (not 3 columns)
  const headerRow = ['Columns (columns9)'];
  // Second row: 3 columns as required
  const contentRow = [logoBlock || '', navBlock || '', socialBlock || ''];
  // Third row: copyright/footer text in first cell, rest blank
  const footerRow = [textBlock || '', '', ''];
  // Compose cells array: header is [headerRow], not [headerRow, headerRow, headerRow]
  const cells = [headerRow, contentRow, footerRow];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
