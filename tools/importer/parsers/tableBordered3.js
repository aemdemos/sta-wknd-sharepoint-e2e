/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse if this is the main container
  if (!element || !element.classList.contains('container')) return;

  // Find the main grid inside the container
  const mainGrid = element.querySelector('.cmp-container > .aem-Grid');
  if (!mainGrid) return;

  // Compose the header row
  const headerRow = ['Table (bordered, tableBordered3)'];

  // Compose the content cell
  const cellContent = [];

  // Get the main title (h1)
  const h1 = mainGrid.querySelector('h1');
  if (h1) cellContent.push(h1.cloneNode(true));

  // Get the left column adventure info (first .contentfragment article)
  const leftColArticle = mainGrid.querySelector('.contentfragment article.cmp-contentfragment');
  if (leftColArticle) cellContent.push(leftColArticle.cloneNode(true));

  // Get the tabs block (first .tabs .cmp-tabs)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (tabsBlock) cellContent.push(tabsBlock.cloneNode(true));

  // Compose the table rows
  const rows = [headerRow, [cellContent]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
