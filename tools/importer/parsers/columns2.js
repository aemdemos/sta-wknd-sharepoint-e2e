/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the header content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Prepare columns array
  const columns = [];

  // Logo column (left)
  const logoCol = grid.querySelector('.image');
  if (logoCol) {
    const logoLink = logoCol.querySelector('a');
    const logoImg = logoCol.querySelector('img');
    let logoFragment;
    if (logoLink && logoImg) {
      logoFragment = document.createElement('a');
      logoFragment.href = logoLink.getAttribute('href');
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt;
      logoFragment.appendChild(img);
    } else if (logoImg) {
      logoFragment = document.createElement('img');
      logoFragment.src = logoImg.src;
      logoFragment.alt = logoImg.alt;
    } else {
      logoFragment = document.createTextNode(logoCol.textContent.trim());
    }
    columns.push(logoFragment);
  }

  // Navigation column (middle)
  const navCol = grid.querySelector('.navigation');
  if (navCol) {
    const navLinks = navCol.querySelectorAll('a');
    if (navLinks.length) {
      const navDiv = document.createElement('div');
      navLinks.forEach((link, i) => {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent;
        navDiv.appendChild(a);
        if (i < navLinks.length - 1) {
          navDiv.appendChild(document.createTextNode(' '));
        }
      });
      columns.push(navDiv);
    }
  }

  // Search column (right)
  const searchCol = grid.querySelector('.search');
  if (searchCol) {
    const input = searchCol.querySelector('input');
    let searchFragment = document.createElement('div');
    if (input && input.placeholder) {
      // Add icon if present in HTML
      const icon = searchCol.querySelector('.cmp-search__icon');
      if (icon) {
        // Use a unicode magnifying glass if icon is present in HTML
        searchFragment.textContent = '\uD83D\uDD0D ' + input.placeholder;
      } else {
        searchFragment.textContent = input.placeholder;
      }
    }
    columns.push(searchFragment);
  }

  // Table header row
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
