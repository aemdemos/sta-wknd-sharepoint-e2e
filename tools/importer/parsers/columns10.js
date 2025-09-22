/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .aem-Grid with column content
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find the logo (image), navigation, follow us title, and social buttons columns
  let logoCol, navCol, followCol;
  const gridChildren = Array.from(mainGrid.children);
  gridChildren.forEach((child) => {
    if (child.classList.contains('image')) logoCol = child;
    if (child.classList.contains('navigation')) navCol = child;
    if (child.classList.contains('title') || child.classList.contains('buildingblock')) {
      if (!followCol) followCol = document.createElement('div');
      followCol.appendChild(child.cloneNode(true));
    }
  });

  // Compose the columns array in visual order: logo, nav, follow/social
  const columns = [];
  if (logoCol) columns.push(logoCol);
  if (navCol) columns.push(navCol);
  if (followCol && followCol.childNodes.length) columns.push(followCol);

  // Find the two text blocks after the grid (footer text)
  // These are .cmp-text blocks in the parent .cmp-container
  const gridParent = mainGrid.parentElement;
  const textBlocks = Array.from(gridParent.querySelectorAll('.cmp-text'));
  const [footerDesc, footerLegal] = textBlocks;

  // Table header
  const headerRow = ['Columns (columns10)'];
  // Table content row: columns side by side
  const contentRow = columns.map(col => col.cloneNode(true));
  // Table footer row: combine both text blocks in a single cell spanning all columns
  let footerRow = [];
  if (footerDesc || footerLegal) {
    const cell = document.createElement('div');
    if (footerDesc) cell.appendChild(footerDesc.cloneNode(true));
    if (footerLegal) cell.appendChild(footerLegal.cloneNode(true));
    footerRow = [cell];
  }
  // Only add the footer row if there is content
  const tableRows = [headerRow, contentRow];
  if (footerRow.length > 0) tableRows.push(footerRow);

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
