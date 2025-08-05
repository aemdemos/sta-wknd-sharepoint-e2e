/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the footer layout (the columns)
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12, .aem-Grid.aem-Grid--tablet--12, .aem-Grid.aem-Grid--default--12, .aem-Grid.aem-Grid--phone--12');
  if (!mainGrid) return;
  // Get all immediate children of the grid (these are the possible columns/rows)
  const gridChildren = Array.from(mainGrid.children);

  // Identify logo, navigation, social area, and footer texts
  let logoElem = null;
  let navElem = null;
  let socialTitleElem = null;
  let socialBtnsElem = null;
  const textElems = [];

  gridChildren.forEach(child => {
    if (!logoElem && child.querySelector('.cmp-image')) {
      logoElem = child;
    } else if (!navElem && child.querySelector('.cmp-navigation')) {
      navElem = child;
    } else if (!socialTitleElem && child.querySelector('.cmp-title')) {
      socialTitleElem = child;
    } else if (!socialBtnsElem && child.querySelector('.cmp-buildingblock--btn-list')) {
      socialBtnsElem = child;
    } else if (child.querySelector('.cmp-text')) {
      const txt = child.querySelector('.cmp-text');
      if (txt) textElems.push(txt);
    }
  });

  // Compose the social column content: title + buttons
  let socialCol = [];
  if (socialTitleElem) socialCol.push(socialTitleElem);
  if (socialBtnsElem) socialCol.push(socialBtnsElem);

  // Table header row - must be a single cell as per requirements
  const headerRow = ['Columns (columns21)'];

  // Main row: logo | navigation | social
  const row1 = [logoElem || '', navElem || '', socialCol.length ? socialCol : ''];

  // Footer text row: single cell spanning all columns (matches the example)
  const row2 = [textElems.length ? textElems : ''];

  // Compose the cells array: header (1 col), then 3 cols, then 1 col
  const cells = [
    headerRow, // 1 column
    row1,      // 3 columns
    row2       // 1 column (spanning all columns)
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with our block table
  element.replaceWith(block);
}
