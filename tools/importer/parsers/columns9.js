/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  function getDirectDivs(parent) {
    return Array.from(parent.querySelectorAll(':scope > div'));
  }

  // Find the deepest grid container (where the content lives)
  let gridContainer = null;
  let search = element;
  // Traverse down until we find the grid
  while (search) {
    const grid = search.querySelector('.aem-Grid');
    if (grid) {
      gridContainer = grid;
      break;
    }
    // Go to first child div
    const next = search.querySelector(':scope > div');
    if (!next || next === search) break;
    search = next;
  }
  if (!gridContainer) return;

  // Get all the direct children columns in the grid
  const gridChildren = getDirectDivs(gridContainer);

  // Find the logo image block
  const logoBlock = gridChildren.find(div => div.classList.contains('image'));
  // Find the navigation block (may be missing in some variants)
  const navBlock = gridChildren.find(div => div.classList.contains('navigation'));
  // Find the "Follow Us" title
  const titleBlock = gridChildren.find(div => div.classList.contains('title'));
  // Find the social button group
  const btnListBlock = gridChildren.find(div => div.classList.contains('buildingblock'));
  // Find the text block (copyright, description, etc)
  const textBlock = gridChildren.find(div => div.classList.contains('text'));

  // Compose left column: logo + navigation (preserve hierarchy and active state) + text
  const leftColumn = [];
  if (logoBlock) {
    const logoAnchor = logoBlock.querySelector('a');
    if (logoAnchor) leftColumn.push(logoAnchor);
  }
  if (navBlock) {
    // Extract navigation preserving hierarchy and active state
    const nav = navBlock.querySelector('nav');
    if (nav) {
      // Clone the nav element and preserve its structure
      leftColumn.push(nav.cloneNode(true));
    }
  }
  if (textBlock) {
    const textDiv = textBlock.querySelector('div');
    if (textDiv) leftColumn.push(textDiv);
  }

  // Compose right column: "Follow Us" title + social buttons
  const rightColumn = [];
  if (titleBlock) {
    const titleDiv = titleBlock.querySelector('div');
    if (titleDiv) rightColumn.push(titleDiv);
  }
  if (btnListBlock) {
    const btnGrid = btnListBlock.querySelector('.aem-Grid');
    if (btnGrid) rightColumn.push(btnGrid);
  }

  // Table structure: header, then one row with two columns
  const headerRow = ['Columns (columns9)'];
  const contentRow = [leftColumn, rightColumn];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
