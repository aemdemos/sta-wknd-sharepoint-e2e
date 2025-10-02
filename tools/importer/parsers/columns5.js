/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the actual content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) grid = element;

  // Get the main columns: logo, navigation, follow us, social buttons
  const logoDiv = grid.querySelector('.image');
  const navDiv = grid.querySelector('.navigation');
  const titleDiv = grid.querySelector('.title');
  const btnListDiv = grid.querySelector('.buildingblock');

  // Get all .text blocks (footer text)
  const textDivs = Array.from(grid.querySelectorAll('.text'));

  // Compose first row: logo, navigation, follow us, social buttons
  // Compose second row: all text blocks (footer copy)
  // Visual layout: 4 columns in first row, 1 column in second row
  const headerRow = ['Columns (columns5)'];

  // Defensive: if any of these are missing, use empty div
  const logoContent = logoDiv ? logoDiv : document.createElement('div');
  const navContent = navDiv ? navDiv : document.createElement('div');
  const titleContent = titleDiv ? titleDiv : document.createElement('div');
  const btnListContent = btnListDiv ? btnListDiv : document.createElement('div');

  // First content row: 4 columns
  const firstContentRow = [logoContent, navContent, titleContent, btnListContent];

  // Second content row: combine all text blocks into one cell
  let textCell;
  if (textDivs.length === 1) {
    textCell = textDivs[0];
  } else if (textDivs.length > 1) {
    // Wrap all text blocks in a container
    const textWrapper = document.createElement('div');
    textDivs.forEach(div => textWrapper.appendChild(div));
    textCell = textWrapper;
  } else {
    textCell = document.createElement('div');
  }
  const secondContentRow = [textCell];

  // Compose table rows
  const rows = [
    headerRow,
    firstContentRow,
    secondContentRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
