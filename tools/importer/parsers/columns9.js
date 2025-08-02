/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Helper to get direct child by partial class match
  function getDirectChild(parent, classPart) {
    return Array.from(parent.children).find(child => child.className && child.className.includes(classPart)) || null;
  }

  // 1. Logo column
  let logoBlock = null;
  const logoCol = getDirectChild(grid, 'image');
  if (logoCol) {
    const logoDiv = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoDiv) logoBlock = logoDiv;
  }

  // 2. Navigation column
  let navBlock = null;
  const navCol = getDirectChild(grid, 'navigation');
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navBlock = nav;
  }

  // 3. Title column
  let titleBlock = null;
  const titleCol = getDirectChild(grid, 'title');
  if (titleCol) {
    const titleDiv = titleCol.querySelector('.cmp-title');
    if (titleDiv) titleBlock = titleDiv;
  }

  // 4. Social buttons column
  let buttonsBlock = null;
  const btnCol = getDirectChild(grid, 'buildingblock');
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) buttonsBlock = btnGrid;
  }

  // Footer/copyright text (goes in last column, second row)
  let textBlock = null;
  const textCol = getDirectChild(grid, 'text');
  if (textCol) {
    const textDiv = textCol.querySelector('.cmp-text');
    if (textDiv) textBlock = textDiv;
  }

  // Compose columns table as per requirements
  const headerRow = ['Columns (columns9)'];
  const firstRow = [logoBlock, navBlock, titleBlock, buttonsBlock];
  const secondRow = ['', '', '', textBlock];
  const cells = [headerRow, firstRow, secondRow];

  // WebImporter.DOMUtils.createTable expects the first row to be a single header cell
  // It will span the columns automatically
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
