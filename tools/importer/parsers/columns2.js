/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main grid inside the block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  let logoCol = null;
  let navCol = null;
  let searchCol = null;
  const gridChildren = Array.from(grid.children);
  for (const child of gridChildren) {
    if (child.classList.contains('image')) logoCol = child;
    else if (child.classList.contains('navigation')) navCol = child;
    else if (child.classList.contains('search')) searchCol = child;
  }

  // Defensive: if logo or search missing, just skip (shouldn't happen)
  if (!logoCol || !searchCol) return;

  // 2 columns: left (logo), right (navigation+search)
  // If navigation is missing, just use logo and search

  // Left column: logo (use the image/link block inside logoCol)
  let logoContent = null;
  const logoImgWrap = logoCol.querySelector('[data-cmp-is="image"]');
  if (logoImgWrap) {
    logoContent = logoImgWrap;
  } else {
    logoContent = logoCol;
  }

  // Right column: navigation (if present) + search (stacked)
  const rightColContent = [];
  if (navCol) {
    // Only include the nav element
    const nav = navCol.querySelector('nav');
    if (nav) rightColContent.push(nav);
  }
  if (searchCol) {
    // Only include the section.cmp-search
    const searchSection = searchCol.querySelector('section.cmp-search');
    if (searchSection) rightColContent.push(searchSection);
  }

  // Compose the table
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoContent, rightColContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
