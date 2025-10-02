/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with .cmp-image--logo as a child
  function findContentGrid(el) {
    let grid = null;
    el.querySelectorAll('.aem-Grid').forEach((g) => {
      if (g.querySelector('.cmp-image--logo')) {
        grid = g;
      }
    });
    return grid;
  }

  const grid = findContentGrid(element);
  if (!grid) return;

  // Get all direct grid columns in order
  const columns = Array.from(grid.children).filter((col) => col.classList && col.classList.value.includes('aem-GridColumn'));

  // Prepare main row for columns block
  const mainRow = [];
  let copyrightRow = null;

  columns.forEach((col) => {
    // Logo
    if (col.classList.contains('cmp-image--logo')) {
      const logo = col.querySelector('[data-cmp-is="image"]');
      if (logo) mainRow.push(logo);
    }
    // Navigation
    else if (col.classList.contains('cmp-navigation--footer')) {
      const nav = col.querySelector('nav');
      if (nav) mainRow.push(nav);
    }
    // Follow Us title
    else if (col.classList.contains('cmp-title--right')) {
      const title = col.querySelector('.cmp-title');
      if (title) mainRow.push(title);
    }
    // Social buttons
    else if (col.classList.contains('cmp-buildingblock--btn-list')) {
      const btnGrid = col.querySelector('.aem-Grid');
      if (btnGrid) {
        const buttons = Array.from(btnGrid.querySelectorAll('.cmp-button'));
        if (buttons.length) {
          const btnFragment = document.createElement('div');
          buttons.forEach(btn => btnFragment.appendChild(btn));
          mainRow.push(btnFragment);
        }
      }
    }
    // Copyright/info
    else if (col.classList.contains('cmp-text--font-xsmall')) {
      const text = col.querySelector('.cmp-text');
      if (text) copyrightRow = [text];
    }
    // Ignore separator
  });

  // Only build if we have at least two columns of content
  if (mainRow.length < 2) return;

  const headerRow = ['Columns (columns9)'];
  const rows = [headerRow, mainRow];
  if (copyrightRow) rows.push(copyrightRow);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
