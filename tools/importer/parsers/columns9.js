/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the footer columns
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  for (let g of grids) {
    const parent = g.parentElement;
    // Main grid is a .aem-Grid inside a .cmp-container and has 4+ direct children
    if (parent && parent.classList.contains('cmp-container')) {
      const children = g.querySelectorAll(':scope > div');
      if (children.length >= 4) {
        grid = g;
        break;
      }
    }
  }
  if (!grid) return;

  // Collect the four columns: Logo, Navigation, Title, Social Buttons
  const gridChildren = grid.querySelectorAll(':scope > div');
  let logoCol, navCol, titleCol, socialCol;
  for (const child of gridChildren) {
    if (child.classList.contains('cmp-image--logo')) {
      // Get the actual image block (the one with data-cmp-is="image")
      logoCol = child.querySelector('[data-cmp-is="image"]') || child;
    }
    if (child.classList.contains('cmp-navigation--footer')) {
      // Get the <nav> element directly
      navCol = child.querySelector('nav') || child;
    }
    if (child.classList.contains('cmp-title--right')) {
      // Get the main title wrapper
      titleCol = child.firstElementChild || child;
    }
    if (child.classList.contains('cmp-buildingblock--btn-list')) {
      // Get the buttons grid itself
      socialCol = child.firstElementChild || child;
    }
  }
  // Ensure we have 4 columns, fill with empty string if missing
  const columns = [logoCol || '', navCol || '', titleCol || '', socialCol || ''];

  // Find the footer legal text block (the cmp-text inside the footer)
  let footerText = element.querySelector('.cmp-text');
  // Use only the actual text block if found, else blank
  const textRow = [footerText || '', '', '', ''];

  // Compose the block table
  const headerRow = ['Columns (columns9)']; // <-- Only one column in header row
  const data = [headerRow, columns, textRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(data, document);

  // Replace the original element in the DOM
  element.replaceWith(table);
}
