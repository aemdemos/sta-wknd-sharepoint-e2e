/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children divs
  function getDirectDivs(el) {
    return Array.from(el.querySelectorAll(':scope > div'));
  }

  // Find the deepest .aem-Grid (main content grid)
  let grid = element;
  let foundGrid = null;
  function findGrid(el) {
    if (el.classList && el.classList.contains('aem-Grid')) {
      foundGrid = el;
      return;
    }
    for (const child of getDirectDivs(el)) {
      findGrid(child);
      if (foundGrid) return;
    }
  }
  findGrid(element);
  grid = foundGrid || element;

  // Get all direct children of the grid
  const gridChildren = getDirectDivs(grid);

  // Identify columns by content type
  let logoCol = null;
  let navCol = null;
  let followCol = null;
  let socialCol = null;
  let separator = null;
  let textBlocks = [];

  gridChildren.forEach((child) => {
    if (child.classList.contains('image')) {
      logoCol = child;
    } else if (child.classList.contains('navigation')) {
      navCol = child;
    } else if (child.classList.contains('title')) {
      followCol = child;
    } else if (child.classList.contains('buildingblock')) {
      socialCol = child;
    } else if (child.classList.contains('separator')) {
      separator = child;
    } else if (child.classList.contains('text')) {
      textBlocks.push(child);
    }
  });

  // Compose the first row: logo, navigation, follow us, social
  const firstRow = [
    logoCol,
    navCol,
    followCol,
    socialCol
  ];

  // Compose the second row: separator + all text blocks (legal/disclaimer)
  // Second row should only have one column, containing all content
  const secondRowContent = [];
  if (separator) secondRowContent.push(separator);
  if (textBlocks.length) secondRowContent.push(...textBlocks);
  const secondRow = [secondRowContent];

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build table
  const cells = [
    headerRow,
    firstRow,
    secondRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
