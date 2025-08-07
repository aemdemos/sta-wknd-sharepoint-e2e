/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest visible .aem-Grid.aem-Grid--12 (the content grid)
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children (columns) of the grid
  const gridChildren = Array.from(grid.children);

  // --- Left column: logo (image block) ---
  const logoCol = gridChildren.find(c => c.classList.contains('image') && c.querySelector('.cmp-image'));
  const logo = logoCol ? logoCol.querySelector('.cmp-image') : null;

  // --- Middle column: navigation (may have just one link or more, may be home only or a multi-level list) ---
  const navCol = gridChildren.find(c => c.classList.contains('navigation') && c.querySelector('nav.cmp-navigation'));
  const nav = navCol ? navCol.querySelector('nav.cmp-navigation') : null;

  // --- Right column: 'Follow Us' title and buildingblock with buttons ---
  const titleCol = gridChildren.find(c => c.classList.contains('title') && c.querySelector('.cmp-title__text'));
  const followTitle = titleCol ? titleCol.querySelector('.cmp-title') : null;
  const socialCol = gridChildren.find(c => c.classList.contains('buildingblock') && c.querySelector('.xf-master-building-block'));
  const socialBlock = socialCol ? socialCol.querySelector('.xf-master-building-block') : null;

  // Compose the right column content: stack the title and social buttons vertically inside the cell
  let rightColContent = [];
  if (followTitle) rightColContent.push(followTitle);
  if (socialBlock) rightColContent.push(socialBlock);
  rightColContent = rightColContent.length === 1 ? rightColContent[0] : rightColContent;

  // Table header: block name
  const headerRow = ['Columns (columns9)'];

  // Columns row: 3 cells for logo, nav, follow/social
  const columnsRow = [logo || '', nav || '', rightColContent || ''];

  // --- Third row: full width text footer ---
  // The text is always a .cmp-text inside a .text class at grid level
  const textCol = gridChildren.find(c => c.classList.contains('text') && c.querySelector('.cmp-text'));
  const footerText = textCol ? textCol.querySelector('.cmp-text') : '';

  // Compose cells array
  const cells = [
    headerRow,
    columnsRow,
    [footerText || ''],
  ];

  // Replace the element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
