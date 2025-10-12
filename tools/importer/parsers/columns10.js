/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the deepest grid container (where columns are visually organized)
  function getGridContainer(el) {
    return el.querySelector('.aem-Grid--12, .aem-Grid');
  }

  // Helper: Extract navigation links (all levels)
  function getNavLinks(navBlock) {
    if (!navBlock) return null;
    const links = [];
    // Top-level navigation
    const navItems = navBlock.querySelectorAll('ul.cmp-navigation__group > li.cmp-navigation__item');
    navItems.forEach(item => {
      const link = item.querySelector('a.cmp-navigation__item-link');
      if (link) {
        links.push(link.cloneNode(true));
      }
      // Check for sub-navigation
      const subNav = item.querySelector('ul.cmp-navigation__group');
      if (subNav) {
        subNav.querySelectorAll('li.cmp-navigation__item').forEach(subItem => {
          const subLink = subItem.querySelector('a.cmp-navigation__item-link');
          if (subLink) {
            links.push(subLink.cloneNode(true));
          }
        });
      }
    });
    if (links.length) {
      // Wrap links in a div for grouping
      const navDiv = document.createElement('div');
      links.forEach(l => navDiv.appendChild(l));
      return navDiv;
    }
    return null;
  }

  // Helper: Get all direct column children from the grid
  function getColumnDivs(grid) {
    // Always: logo, navigation, follow us/social
    const columns = [];
    // Logo
    const logo = grid && grid.querySelector('.image');
    if (logo) columns.push(logo);
    // Navigation
    const navBlock = grid && grid.querySelector('.navigation');
    const navLinks = getNavLinks(navBlock);
    if (navLinks) columns.push(navLinks);
    // Follow Us title + social buttons
    const title = grid && grid.querySelector('.title');
    const social = grid && grid.querySelector('.buildingblock');
    if (title && social) {
      columns.push([title, social]);
    } else if (title) {
      columns.push(title);
    } else if (social) {
      columns.push(social);
    }
    return columns;
  }

  // Helper: Get the copyright/description text block
  function getTextBlock(el) {
    return el.querySelector('.text');
  }

  const grid = getGridContainer(element);
  const columns = getColumnDivs(grid);

  // Compose table rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = columns;

  // Third row: copyright/description text (must have same number of columns as contentRow)
  const textBlock = getTextBlock(element);
  const rows = [headerRow, contentRow];
  if (textBlock) {
    // Place textBlock in first cell, others empty
    const thirdRow = [textBlock];
    while (thirdRow.length < contentRow.length) {
      thirdRow.push('');
    }
    rows.push(thirdRow);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
