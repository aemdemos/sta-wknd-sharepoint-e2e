/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    // Only keep columns that are not separators
    return !col.classList.contains('cmp-separator--hidden');
  });

  // There are 4 main columns visually: logo, nav, follow us title, social buttons
  // But the layout is visually 3 columns: (logo + nav), (follow us + social), (footer text)
  // However, the screenshot shows 2 columns: left (logo+nav+text), right (follow us+social)

  // Find logo (image)
  const logoCol = columns.find((col) => col.querySelector('.cmp-image--logo'));
  const logo = logoCol ? logoCol.querySelector('.cmp-image') : null;

  // Find navigation
  const navCol = columns.find((col) => col.querySelector('.cmp-navigation'));
  const nav = navCol ? navCol.querySelector('.cmp-navigation') : null;

  // Find follow us title
  const followTitleCol = columns.find((col) => col.querySelector('.cmp-title'));
  const followTitle = followTitleCol ? followTitleCol.querySelector('.cmp-title') : null;

  // Find social buttons (building block)
  const socialCol = columns.find((col) => col.querySelector('.cmp-buildingblock--btn-list'));
  const socialBlock = socialCol ? socialCol.querySelector('.cmp-buildingblock--btn-list') : null;

  // Find all text blocks (footer text)
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));

  // Compose left column: logo, nav, all text blocks
  const leftColContent = [];
  if (logo) leftColContent.push(logo);
  if (nav) leftColContent.push(nav);
  textBlocks.forEach(tb => leftColContent.push(tb));

  // Compose right column: follow us title, social buttons
  const rightColContent = [];
  if (followTitle) rightColContent.push(followTitle);
  if (socialBlock) rightColContent.push(socialBlock);

  // Table header
  const headerRow = ['Columns (columns10)'];
  // Table content row (2 columns)
  const contentRow = [leftColContent, rightColContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
