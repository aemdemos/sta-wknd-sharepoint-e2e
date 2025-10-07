/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header
  const headerRow = ['Columns (columns2)'];

  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (logo, navigation, search)
  const columns = Array.from(grid.children);

  // --- LOGO ---
  const logoDiv = columns.find(col => col.classList.contains('image'));
  let logoContent = '';
  if (logoDiv) {
    const logoImgBlock = logoDiv.querySelector('[data-cmp-is="image"]');
    if (logoImgBlock) {
      const logoLink = logoImgBlock.querySelector('a');
      if (logoLink) {
        logoContent = logoLink.cloneNode(true);
      } else {
        logoContent = logoImgBlock.cloneNode(true);
      }
    } else {
      logoContent = logoDiv.textContent.trim();
    }
  }

  // --- NAVIGATION (center column: only include visible text content) ---
  // The navigation is hidden on desktop/tablet, so center column should be empty for spacing.
  let navContent = '';

  // --- SEARCH ---
  const searchDiv = columns.find(col => col.classList.contains('search'));
  let searchContent = '';
  if (searchDiv) {
    const searchSection = searchDiv.querySelector('section');
    if (searchSection) {
      // Compose: search icon + placeholder as visible text
      const input = searchSection.querySelector('input[type="text"]');
      if (input) {
        const searchBox = document.createElement('div');
        // Add magnifier icon (from HTML if present)
        const icon = searchSection.querySelector('i[data-cmp-hook-search="icon"]');
        if (icon) {
          searchBox.appendChild(icon.cloneNode(true));
        }
        // Add placeholder text as visible
        const placeholder = document.createElement('span');
        placeholder.textContent = input.getAttribute('placeholder') || '';
        searchBox.appendChild(placeholder);
        searchContent = searchBox;
      } else {
        searchContent = searchSection.cloneNode(true);
      }
    }
  }

  // Build the columns row
  let contentRow = [logoContent, navContent, searchContent];

  // Compose the table
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
