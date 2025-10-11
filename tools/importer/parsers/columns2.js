/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // --- LOGO COLUMN ---
  let logoContent = '';
  const logoCol = Array.from(grid.children).find(child => child.classList.contains('image'));
  if (logoCol) {
    // Use the linked image if present
    const link = logoCol.querySelector('a');
    if (link) {
      logoContent = link.cloneNode(true);
    } else {
      const img = logoCol.querySelector('img');
      if (img) {
        logoContent = img.cloneNode(true);
      } else {
        logoContent = logoCol.textContent.trim();
      }
    }
  }

  // --- NAVIGATION COLUMN ---
  let navContent = '';
  const navCol = Array.from(grid.children).find(child => child.classList.contains('navigation'));
  if (navCol) {
    // Get all navigation links (level 0 and level 1)
    const navLinks = navCol.querySelectorAll('.cmp-navigation__item-link');
    if (navLinks.length) {
      const navFrag = document.createElement('div');
      navLinks.forEach((a, i) => {
        navFrag.appendChild(a.cloneNode(true));
        if (i < navLinks.length - 1) navFrag.appendChild(document.createTextNode(' '));
      });
      navContent = navFrag;
    } else {
      navContent = navCol.textContent.trim();
    }
  }

  // --- SEARCH COLUMN ---
  let searchContent = '';
  const searchCol = Array.from(grid.children).find(child => child.classList.contains('search'));
  if (searchCol) {
    const icon = searchCol.querySelector('.cmp-search__icon');
    const input = searchCol.querySelector('input[type="text"]');
    let placeholderText = '';
    if (input && input.placeholder) {
      placeholderText = input.placeholder.trim();
    }
    const searchFrag = document.createElement('div');
    if (icon) searchFrag.appendChild(icon.cloneNode(true));
    if (placeholderText) searchFrag.appendChild(document.createTextNode(' ' + placeholderText));
    searchContent = searchFrag.childNodes.length ? searchFrag : searchCol.textContent.trim();
  }

  // Three columns: logo, navigation, search
  const columns = [logoContent, navContent, searchContent];
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
