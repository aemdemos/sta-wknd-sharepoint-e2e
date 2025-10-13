/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns2)'];

  // Defensive: Find the main grid container (holds logo, nav, search)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct grid children (columns)
  const columns = Array.from(grid.children);

  // Find logo column (image)
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoContent = '';
  if (logoCol) {
    // Use the logo image link (usually <a><img/></a>)
    const logoImgLink = logoCol.querySelector('a');
    if (logoImgLink) {
      logoContent = logoImgLink;
    } else {
      // fallback: just the image
      const img = logoCol.querySelector('img');
      if (img) logoContent = img;
    }
  }

  // Find navigation column (may be missing)
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navContent = '';
  if (navCol) {
    // Use the nav element directly
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // Find search column
  const searchCol = columns.find(col => col.classList.contains('search'));
  let searchContent = '';
  if (searchCol) {
    // Use the section (search block)
    const searchSection = searchCol.querySelector('section');
    if (searchSection) searchContent = searchSection;
  }

  // Compose columns for the block
  // Always: logo (left), search (right)
  // Optionally: navigation (center)
  let contentRow;
  if (navContent) {
    // 3 columns: logo, navigation, search
    contentRow = [logoContent, navContent, searchContent];
  } else {
    // 2 columns: logo, search
    contentRow = [logoContent, searchContent];
  }

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
