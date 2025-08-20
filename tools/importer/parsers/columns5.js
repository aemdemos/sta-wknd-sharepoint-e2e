/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the footer columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get the five columns: logo, navigation, title, buttons, text
  const logoCol = grid.querySelector('.cmp-image--logo');
  const navCol = grid.querySelector('.cmp-navigation--footer');
  const titleCol = grid.querySelector('.cmp-title--right');
  const btnCol = grid.querySelector('.cmp-buildingblock--btn-list');

  // Gather all text blocks used in the footer (may be more or less than 2, be robust)
  const textCols = Array.from(grid.querySelectorAll('.cmp-text--font-xsmall'));
  // If there are separator blocks, skip them
  // Compose a wrapper for all text elements
  const textWrapper = document.createElement('div');
  textCols.forEach(tc => textWrapper.appendChild(tc));

  // If any column is missing, create an empty div as placeholder to ensure 5 columns always
  const ensure = (node) => node ? node : document.createElement('div');

  const cells = [
    ['Columns (columns5)'],
    [ensure(logoCol), ensure(navCol), ensure(titleCol), ensure(btnCol), textWrapper]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
