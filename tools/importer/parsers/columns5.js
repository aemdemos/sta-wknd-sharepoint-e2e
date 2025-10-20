/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // --- LOGO COLUMN ---
  let logoCell;
  const logoCol = grid.querySelector('.cmp-image--logo');
  if (logoCol) {
    logoCell = document.createElement('div');
    // Always include both the logo image and its alt text as visible text
    const img = logoCol.querySelector('img');
    if (img) {
      logoCell.appendChild(img.cloneNode(true));
      if (img.alt && img.alt.trim()) {
        // Add alt text as visible text (e.g. 'WKND Logo')
        const altDiv = document.createElement('div');
        altDiv.textContent = img.alt.trim();
        logoCell.appendChild(altDiv);
      }
    }
    // Also add any visible text in the logoCol that is not the image alt
    const visibleText = logoCol.textContent.trim();
    if (
      visibleText &&
      (!img || (img.alt && visibleText !== img.alt.trim()))
    ) {
      const textDiv = document.createElement('div');
      textDiv.textContent = visibleText;
      logoCell.appendChild(textDiv);
    }
  }

  // --- NAVIGATION COLUMN ---
  let navCell;
  const navCol = grid.querySelector('.cmp-navigation--header');
  if (navCol) {
    navCell = document.createElement('div');
    // Extract all visible navigation links
    const navLinks = navCol.querySelectorAll('a');
    navLinks.forEach((a) => {
      const navDiv = document.createElement('div');
      navDiv.textContent = a.textContent.trim();
      navCell.appendChild(navDiv);
    });
  }

  // --- SEARCH COLUMN ---
  let searchCell;
  const searchCol = grid.querySelector('.cmp-search--header');
  if (searchCol) {
    searchCell = document.createElement('div');
    // Extract the search input placeholder text (preserve casing)
    const input = searchCol.querySelector('input[placeholder]');
    if (input && input.placeholder) {
      searchCell.textContent = input.placeholder;
    }
  }

  // Compose the columns array (logo, navigation, search)
  const columns = [];
  if (logoCell) columns.push(logoCell);
  if (navCell) columns.push(navCell);
  if (searchCell) columns.push(searchCell);

  // Header row as required
  const headerRow = ['Columns (columns5)'];

  // Table row: one cell per column, using the extracted content
  const tableRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    tableRow,
  ], document);

  element.replaceWith(table);
}
