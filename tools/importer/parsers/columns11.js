/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid that holds the footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Gather all blocks to combine into first column
  const logoCol = grid.querySelector('.image');
  const logoBlock = logoCol ? (logoCol.querySelector('[data-cmp-is="image"]') || logoCol) : null;

  const navCol = grid.querySelector('.navigation');
  const navBlock = navCol ? (navCol.querySelector('nav') || navCol) : null;

  const titleCol = grid.querySelector('.title');
  const titleBlock = titleCol ? (titleCol.querySelector('.cmp-title') || titleCol) : null;

  const socialCol = grid.querySelector('.cmp-buildingblock--btn-list');
  const socialBlock = socialCol ? (socialCol.querySelector('.aem-Grid') || socialCol) : null;

  const textCol = grid.querySelector('.cmp-text');
  const textBlock = textCol ? textCol : null;

  // Combine all non-copyright elements into the first column
  const col1 = [];
  if (logoBlock) col1.push(logoBlock);
  if (navBlock) col1.push(navBlock);
  if (titleBlock) col1.push(titleBlock);
  if (socialBlock) col1.push(socialBlock);

  // Only copyright text in the second column
  const col2 = [];
  if (textBlock) col2.push(textBlock);

  // Require both columns for the block
  if (col1.length === 0 || col2.length === 0) return;

  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns11)'],
    [col1, col2]
  ], document);
  element.replaceWith(table);
}
