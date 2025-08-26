/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid containing footer columns
  function getMainGrid(el) {
    // Find the deepest .aem-Grid inside "element"
    return el.querySelector('.aem-Grid');
  }

  // Extract columns: logo image, navigation, follow-us title, social buttons, and footer text
  const grid = getMainGrid(element);
  if (!grid) return;
  const columns = Array.from(grid.children).filter(div => div.tagName === 'DIV');

  // Identify which columns are which by their classes
  let logoCol, navCol, titleCol, socialCol, textCol;
  columns.forEach(col => {
    if (col.className.includes('cmp-image--logo')) logoCol = col;
    else if (col.className.includes('cmp-navigation--footer')) navCol = col;
    else if (col.className.includes('cmp-title--right')) titleCol = col;
    else if (col.className.includes('cmp-buildingblock--btn-list')) socialCol = col;
    else if (col.className.includes('cmp-text--font-xsmall')) textCol = col;
  });

  // LOGO: the image block
  let logoContent = '';
  if (logoCol) {
    // Use the entire image component (contains <a><img>)
    const imgDiv = logoCol.querySelector('[data-cmp-is="image"]');
    if (imgDiv) logoContent = imgDiv;
  }

  // NAVIGATION: the nav block
  let navContent = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // SOCIAL/TITLE COLUMN: follow-us heading, social links, copyright/info
  let col3Els = [];
  if (titleCol) {
    const h = titleCol.querySelector('h4, h3, h2, h1');
    if (h) col3Els.push(h);
  }
  if (socialCol) {
    const grid2 = socialCol.querySelector('.aem-Grid');
    if (grid2) {
      // Each button is in a direct child div of grid2
      Array.from(grid2.children).forEach(btnDiv => {
        const btn = btnDiv.querySelector('a');
        if (btn) col3Els.push(btn);
      });
    }
  }
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) col3Els.push(textBlock);
  }

  // Compose the table: header row, then a row with three columns
  const cells = [
    ['Columns (columns11)'],
    [logoContent || '', navContent || '', col3Els.length === 1 ? col3Els[0] : col3Els]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
