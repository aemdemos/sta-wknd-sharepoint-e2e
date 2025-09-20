/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getImmediateChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the deepest grid containing the footer columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) {
    grid = element;
  }

  // Get all column blocks (logo, nav, title, social, etc)
  let logo, nav, title, social, text1, text2;
  getImmediateChildren(grid, 'div').forEach(div => {
    if (div.classList.contains('image')) {
      logo = div;
    } else if (div.classList.contains('navigation')) {
      nav = div;
    } else if (div.classList.contains('title')) {
      title = div;
    } else if (div.classList.contains('buildingblock')) {
      social = div;
    } else if (div.classList.contains('text')) {
      if (!text1) text1 = div;
      else text2 = div;
    }
  });

  // Compose first row: logo, nav, title, social
  const firstContentRow = [logo, nav, title, social].filter(Boolean);

  // Compose second row: both text blocks into a single cell for full-width
  let secondContentRow = [];
  if (text1 || text2) {
    const cell = document.createElement('div');
    if (text1) cell.appendChild(text1);
    if (text2) cell.appendChild(text2);
    secondContentRow = [cell];
  }

  // Build table rows
  const headerRow = ['Columns (columns5)'];
  const rows = [headerRow];
  if (firstContentRow.length) {
    rows.push(firstContentRow);
  }
  if (secondContentRow.length) {
    rows.push(secondContentRow); // No <hr> in this row
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
