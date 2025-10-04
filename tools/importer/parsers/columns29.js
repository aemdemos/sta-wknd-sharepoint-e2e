/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children of a container
  function getDirectChildren(parent, selector = ':scope > *') {
    return Array.from(parent.querySelectorAll(selector));
  }

  // Find the main content area for the columns block
  // We'll use the main content column (not the sidebar)
  let mainContent = null;
  // Find the first main.container that contains the article
  if (element.matches('main.container')) {
    mainContent = element;
  } else {
    mainContent = element.querySelector('main.container');
  }

  // Defensive: if not found, fallback to element itself
  if (!mainContent) mainContent = element;

  // Find the main column (8/12 grid)
  let columnsArea = mainContent.querySelector('main.container.aem-GridColumn--default--8');
  if (!columnsArea) {
    // fallback to the first main.container child
    columnsArea = mainContent.querySelector('main.container');
  }
  if (!columnsArea) columnsArea = mainContent;

  // Get all direct children of the main column
  const mainChildren = getDirectChildren(columnsArea);

  // We'll build up the columns content by grouping visually
  // Screenshot shows the main column is one big column, sidebar is another
  // We'll use two columns: main content and sidebar

  // --- Column 1: Main Content ---
  // Compose all main content into a single container
  const mainCol = document.createElement('div');
  mainCol.style.display = 'flex';
  mainCol.style.flexDirection = 'column';
  mainCol.style.gap = '1em';
  mainChildren.forEach((child) => {
    // Only include non-empty elements
    if (child && child.textContent.trim() !== '' && child.tagName !== 'ASIDE') {
      mainCol.appendChild(child);
    }
  });

  // --- Column 2: Sidebar Content ---
  // Find the aside sidebar
  let sidebar = mainContent.querySelector('aside.container');
  if (!sidebar) {
    // Sometimes sidebar is a sibling of mainContent
    sidebar = element.querySelector('aside.container');
  }
  let sidebarCol = null;
  if (sidebar) {
    sidebarCol = document.createElement('div');
    sidebarCol.style.display = 'flex';
    sidebarCol.style.flexDirection = 'column';
    sidebarCol.style.gap = '1em';
    // Only include direct children of sidebar
    getDirectChildren(sidebar).forEach((child) => {
      if (child && child.textContent.trim() !== '') {
        sidebarCol.appendChild(child);
      }
    });
  }

  // --- Table Construction ---
  // Header row
  const headerRow = ['Columns (columns29)'];

  // Content row: two columns (main, sidebar)
  const contentRow = sidebarCol ? [mainCol, sidebarCol] : [mainCol];

  // Create the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
