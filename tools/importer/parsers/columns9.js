/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the content columns (logo, nav, follow, buttons)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Collect columns (logo, navigation, follow title, button list), in order
  let logo = null, nav = null, followTitle = null, btnList = null;
  const gridChildren = Array.from(grid.children);
  for (let i = 0; i < gridChildren.length; i++) {
    const child = gridChildren[i];
    if (!logo && child.classList.contains('image')) {
      logo = child;
    } else if (!nav && child.classList.contains('navigation')) {
      nav = child;
    } else if (!followTitle && child.classList.contains('title')) {
      followTitle = child;
    } else if (!btnList && child.classList.contains('buildingblock')) {
      btnList = child;
    }
  }
  // Compose the columns row: logo, nav, follow title, button list (always 4 columns)
  const columnsRow = [];
  if (logo) columnsRow.push(logo); else columnsRow.push('');
  if (nav) columnsRow.push(nav); else columnsRow.push('');
  if (followTitle) columnsRow.push(followTitle); else columnsRow.push('');
  if (btnList) columnsRow.push(btnList); else columnsRow.push('');

  // Find all text blocks that follow the separator
  let separator = null;
  for (let c of gridChildren) {
    if (c.classList.contains('separator')) {
      separator = c;
      break;
    }
  }
  // Collect all text blocks after the separator
  const textBlocks = [];
  if (separator) {
    let found = false;
    for (let c of gridChildren) {
      if (c === separator) {
        found = true;
        continue;
      }
      if (found && c.classList.contains('text')) {
        // Only push the inner .cmp-text div
        const cmpTxt = c.querySelector('.cmp-text');
        if (cmpTxt) textBlocks.push(cmpTxt);
      }
    }
  }
  // Compose a row for the text blocks. Place all texts in the first cell, the rest empty for a full-width row.
  let textRow = null;
  if (textBlocks.length > 0) {
    textRow = Array(columnsRow.length).fill('');
    textRow[0] = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
  }

  // Compose the table cells: header is a single cell (not split into columns)
  const cells = [
    ['Columns'],
    columnsRow,
  ];
  if (textRow) cells.push(textRow);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
