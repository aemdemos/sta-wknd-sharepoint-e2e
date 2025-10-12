/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns2)'];

  // Defensive: Find the main grid containing columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // We'll collect column elements for the second row
  const colCells = [];

  // --- LEFT COLUMN: Logo (should include both image and text if present) ---
  let logoContent = '';
  const logoCol = columns.find(col => col.classList.contains('image'));
  if (logoCol) {
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoBlock) {
      const img = logoBlock.querySelector('img');
      let logoText = '';
      if (img && img.alt) {
        logoText = img.alt.replace(' Logo', '').trim();
      }
      if (!logoText) {
        logoText = logoBlock.textContent.trim();
      }
      if (!logoText) {
        logoText = logoCol.textContent.trim();
      }
      // Compose both image and text if possible
      if (img && logoText) {
        const wrapper = document.createElement('div');
        wrapper.appendChild(img.cloneNode(true));
        // Only add text if it's not already visually present in the image alt
        if (logoText && logoText !== img.alt) {
          const textNode = document.createElement('span');
          textNode.textContent = logoText;
          wrapper.appendChild(textNode);
        }
        logoContent = wrapper;
      } else if (img) {
        logoContent = img.cloneNode(true);
      } else {
        logoContent = logoText;
      }
    } else {
      logoContent = logoCol.textContent.trim();
    }
  }

  // --- CENTER COLUMN: Navigation (must include all text content, e.g. 'Deutsch') ---
  let navContent = '';
  const navCol = columns.find(col => col.classList.contains('navigation'));
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) {
      // Extract all <a> links as elements (should include 'Deutsch')
      const links = Array.from(navBlock.querySelectorAll('a'));
      if (links.length) {
        const navDiv = document.createElement('div');
        links.forEach(link => navDiv.appendChild(link.cloneNode(true)));
        navContent = navDiv;
      } else {
        navContent = navBlock.textContent.trim();
      }
    } else {
      navContent = navCol.textContent.trim();
    }
  }

  // --- RIGHT COLUMN: Search field (include icon, input, clear button, loading indicator) ---
  let searchContent = '';
  const searchCol = columns.find(col => col.classList.contains('search'));
  if (searchCol) {
    const searchBlock = searchCol.querySelector('section');
    if (searchBlock) {
      const field = searchBlock.querySelector('.cmp-search__field');
      if (field) {
        // Compose a div with icon, input, button, and loading indicator
        const searchDiv = document.createElement('div');
        // Icon
        const icon = field.querySelector('.cmp-search__icon');
        if (icon) {
          searchDiv.appendChild(icon.cloneNode(true));
        }
        // Input
        const input = field.querySelector('input');
        if (input) {
          searchDiv.appendChild(input.cloneNode(true));
        }
        // Button (Entfernen)
        const button = field.querySelector('button');
        if (button) {
          searchDiv.appendChild(button.cloneNode(true));
        }
        // Loading indicator
        const loading = field.querySelector('.cmp-search__loading-indicator');
        if (loading) {
          searchDiv.appendChild(loading.cloneNode(true));
        }
        searchContent = searchDiv;
      } else {
        searchContent = searchBlock.cloneNode(true);
      }
    }
  }

  // Build the columns row: logo, navigation, search
  colCells.push(logoContent);
  colCells.push(navContent);
  colCells.push(searchContent);

  // Compose the table rows
  const rows = [headerRow, colCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
