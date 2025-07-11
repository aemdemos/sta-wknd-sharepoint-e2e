/* global WebImporter */
export default function parse(element, { document }) {
  // Get the innermost .aem-Grid inside the footer - this holds the columns
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // The main columns are direct children of the .aem-Grid that have both .aem-GridColumn and one of the block classes
  // We'll process in layout order, but only care about logo, navigation, title, and social buttons for columns
  let logoContent = '', navContent = '', titleContent = '', socialContent = '';
  let foundLogo = false, foundNav = false, foundTitle = false, foundSocial = false;
  const gridChildren = Array.from(mainGrid.children);
  for (const child of gridChildren) {
    if (!foundLogo && child.classList.contains('cmp-image--logo')) {
      const cmpImage = child.querySelector('.cmp-image');
      if (cmpImage) logoContent = cmpImage;
      foundLogo = true;
    } else if (!foundNav && child.classList.contains('cmp-navigation--footer')) {
      const nav = child.querySelector('nav');
      if (nav) navContent = nav;
      foundNav = true;
    } else if (!foundTitle && child.classList.contains('cmp-title--right')) {
      const title = child.querySelector('.cmp-title');
      if (title) titleContent = title;
      foundTitle = true;
    } else if (!foundSocial && child.classList.contains('cmp-buildingblock--btn-list')) {
      // Use the .aem-Grid inside social for all buttons
      const innerGrid = child.querySelector('.aem-Grid');
      if (innerGrid) socialContent = innerGrid;
      foundSocial = true;
    }
  }

  // Columns in order: logo, navigation, title, social
  const columns = [logoContent, navContent, titleContent, socialContent];

  // Header row as in the example
  const headerRow = ['Columns (columns5)'];

  // Extract all text blocks (footer text)
  // These are .cmp-text--font-xsmall at the end of .aem-Grid
  const textBlocks = Array.from(mainGrid.querySelectorAll('.cmp-text--font-xsmall'));
  const textRows = textBlocks.map(tb => {
    const cmpText = tb.querySelector('.cmp-text');
    return [cmpText ? cmpText : ''];
  });

  // Compose the table rows
  const rows = [];
  rows.push(headerRow);
  rows.push(columns);
  if (textRows.length) {
    rows.push(...textRows);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
