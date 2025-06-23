/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-container inside this main
  let mainContainer = element.querySelector('.cmp-container');
  if (!mainContainer) {
    // fallback: look for main .cmp-container in descendants
    mainContainer = element.closest('.cmp-container') || element;
  }

  // Get the main content column (should be the 8-wide main column)
  let mainColumn = null;
  const mainCols = element.querySelectorAll('main.container');
  for (const mc of mainCols) {
    // Pick the main column with .cmp-container inside it
    if (mc.querySelector('.cmp-container .contentfragment')) {
      mainColumn = mc;
      break;
    }
  }
  if (!mainColumn) mainColumn = element;

  // Get the sidebar column (aside)
  let sidebar = element.querySelector('aside.container');
  if (!sidebar) {
    sidebar = document.querySelector('aside.container');
  }

  // Compose the main column cell content
  const mainColumnContent = [];

  // Title (h1)
  const h1 = mainColumn.querySelector('.cmp-title__text, h1.cmp-title__text');
  if (h1) mainColumnContent.push(h1);

  // Byline (h4) - typically author
  const h4 = mainColumn.querySelector('h4.cmp-title__text');
  if (h4) mainColumnContent.push(h4);

  // Article/content fragment
  const article = mainColumn.querySelector('article.cmp-contentfragment');
  if (article) mainColumnContent.push(article);

  // Byline/profile block at the bottom
  const bylineBlock = mainColumn.querySelector('.cmp-experiencefragment, .cmp-byline');
  if (bylineBlock) mainColumnContent.push(bylineBlock);

  // Defensive fallback: if no content was found, use the main column itself
  if (mainColumnContent.length === 0) mainColumnContent.push(mainColumn);

  // Compose the columns table: header row, then columns row
  const headerRow = ['Columns (columns29)'];
  const columnsRow = [mainColumnContent, sidebar];

  // Create the table block
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(blockTable);
}
