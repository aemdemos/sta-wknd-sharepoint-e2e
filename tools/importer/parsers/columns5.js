/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the logo image block (first column)
  const logoCol = grid.querySelector('.image');
  let logoBlock = logoCol || '';

  // Find the navigation block (second column)
  const navCol = grid.querySelector('.navigation');
  let navBlock = navCol || '';

  // Find the "Follow Us" title (third column)
  const titleCol = grid.querySelector('.title');
  let titleBlock = titleCol || '';

  // Find the social buttons (fourth column)
  const btnListCol = grid.querySelector('.cmp-buildingblock--btn-list');
  let btnListBlock = btnListCol || '';

  // Find both text blocks (footer text)
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));

  // Compose the columns for the first row (logo, nav, follow us + buttons)
  // The visual layout is 3 columns: logo, nav, follow us + buttons
  const firstRow = [
    logoBlock,
    navBlock,
    [titleBlock, btnListBlock], // combine "Follow Us" and buttons in one column
  ];

  // Compose the second row: all footer text in one column spanning all columns (no separator/hr)
  // Only include text blocks, no separator/hr
  const secondRow = [
    [ ...textBlocks ],
    '',
    '',
  ];

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build the table
  const cells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
