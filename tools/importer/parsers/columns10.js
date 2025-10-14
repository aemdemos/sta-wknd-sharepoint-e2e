/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the deepest grid with actual content
  function findContentGrid(el) {
    return el.querySelector('.aem-Grid');
  }

  const grid = findContentGrid(element);
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Find logo, navigation, follow us, buttons, text
  let logoDiv = columns.find(div => div.classList.contains('image'));
  let navigationDiv = columns.find(div => div.classList.contains('navigation'));
  let titleDiv = columns.find(div => div.classList.contains('title'));
  let buttonListDiv = columns.find(div => div.classList.contains('buildingblock'));
  let textDiv = columns.find(div => div.classList.contains('text'));

  // Compose the columns
  let logoContent = logoDiv ? logoDiv : '';
  let navContent = navigationDiv ? navigationDiv : '';
  let followUsContent = [];
  if (titleDiv) followUsContent.push(titleDiv);
  if (buttonListDiv) followUsContent.push(buttonListDiv);

  // Compose the first content row
  let contentRow;
  let numColumns;
  if (navContent) {
    contentRow = [logoContent, navContent, followUsContent];
    numColumns = 3;
  } else {
    contentRow = [logoContent, followUsContent];
    numColumns = 2;
  }

  // Compose the footer row: should be a single cell spanning all columns
  let footerRow = [];
  if (textDiv) {
    // Use an array with a single cell containing textDiv
    footerRow = [textDiv];
  }

  // Compose the table
  const headerRow = ['Columns (columns10)'];
  const rows = [headerRow, contentRow, footerRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the last row to span all columns
  const tableRows = block.querySelectorAll('tr');
  if (tableRows.length > 2 && footerRow.length === 1) {
    const lastRow = tableRows[2];
    const firstCell = lastRow.cells[0];
    if (numColumns > 1) {
      firstCell.colSpan = numColumns;
      // Remove any extra cells
      while (lastRow.cells.length > 1) {
        lastRow.deleteCell(1);
      }
    }
  }

  // Replace the original element
  element.replaceWith(block);
}
