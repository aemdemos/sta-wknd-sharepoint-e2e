/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid inside the element
  const grids = element.querySelectorAll('.aem-Grid');
  const grid = grids.length ? grids[grids.length - 1] : element;

  // Find columns by class
  const logoCol = grid.querySelector('.cmp-image--logo');
  const navCol = grid.querySelector('.cmp-navigation--footer');
  const followCol = grid.querySelector('.cmp-title--right');
  const socialCol = grid.querySelector('.cmp-buildingblock--btn-list');
  const textCol = grid.querySelector('.cmp-text--font-xsmall');

  // Compose left column: logo + nav
  const leftCol = document.createElement('div');
  if (logoCol) {
    const logoImgDiv = logoCol.querySelector('.cmp-image');
    if (logoImgDiv) leftCol.appendChild(logoImgDiv.cloneNode(true));
  }
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) leftCol.appendChild(nav.cloneNode(true));
  }

  // Compose middle column: Follow Us + social buttons
  const middleCol = document.createElement('div');
  if (followCol) {
    const titleDiv = followCol.querySelector('.cmp-title');
    if (titleDiv) middleCol.appendChild(titleDiv.cloneNode(true));
  }
  if (socialCol) {
    const socialGrid = socialCol.querySelector('.aem-Grid');
    if (socialGrid) {
      const buttons = Array.from(socialGrid.querySelectorAll('.cmp-button'));
      buttons.forEach(btn => middleCol.appendChild(btn.cloneNode(true)));
    }
  }

  // Compose right column: all text content
  let rightCol = '';
  if (textCol) {
    const t = textCol.querySelector('.cmp-text');
    if (t) {
      const textDiv = document.createElement('div');
      Array.from(t.childNodes).forEach(node => textDiv.appendChild(node.cloneNode(true)));
      rightCol = textDiv.childNodes.length ? textDiv : '';
    }
  }

  // Build the row with only non-empty columns
  const row = [];
  if (leftCol.childNodes.length) row.push(leftCol);
  if (middleCol.childNodes.length) row.push(middleCol);
  if (rightCol && rightCol.childNodes && rightCol.childNodes.length) row.push(rightCol);

  // Fallback: if all columns are empty, extract all text content from element
  if (row.length === 0) {
    const allTextDiv = document.createElement('div');
    Array.from(element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span')).forEach(node => {
      allTextDiv.appendChild(node.cloneNode(true));
    });
    if (allTextDiv.childNodes.length) {
      row.push(allTextDiv);
    }
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns9)'];
  const cells = [headerRow];
  if (row.length) cells.push(row);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
