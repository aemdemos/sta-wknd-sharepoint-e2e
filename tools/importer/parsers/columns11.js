/* global WebImporter */
export default function parse(element, { document }) {
  // Per the markdown example, this is a 2-row, 2-column table (header row, then 2 columns),
  // Each column is a block of content (side-by-side in the screenshot, so Columns block).
  // The first/main column is the main article content area, second is the sidebar.
  
  // 1. Find the main content column (the 'main' tag with class containing 'responsivegrid' and NOT just the outermost one)
  // 2. Find the aside sidebar (the 'aside' tag with class containing 'responsivegrid')
  // 3. Compose the block table: first row is ["Columns (columns11)"]
  //    second row is [main column, sidebar]

  // Find all immediate children that are 'main.container.responsivegrid' and 'aside.container.responsivegrid'
  // But ensure not to grab the outermost element again!
  
  // We are given: outermost <main class="container responsivegrid...">, which wraps everything.
  // Inside it, there is a <main ...> (article area) and <aside ...> (sidebar), each with their own class.

  // Find the correct main (article) and aside (sidebar)
  let mainContent = null;
  let sidebarContent = null;
  Array.from(element.children).forEach(child => {
    if (
      child.tagName === 'MAIN' &&
      child.classList.contains('container') &&
      child.classList.contains('responsivegrid') &&
      child !== element
    ) {
      mainContent = child;
    }
    if (
      child.tagName === 'ASIDE' &&
      child.classList.contains('container') &&
      child.classList.contains('responsivegrid')
    ) {
      sidebarContent = child;
    }
  });

  // Fallback: if not found, try to find first/second by order
  if (!mainContent) {
    mainContent = element.querySelector('main.container.responsivegrid');
    if (mainContent === element) {
      // avoid recursive selection of self
      mainContent = null;
    }
  }
  if (!sidebarContent) {
    sidebarContent = element.querySelector('aside.container.responsivegrid');
  }

  // Prepare columns for second row, only use as many as are present
  const columns = [];
  if (mainContent) columns.push(mainContent);
  if (sidebarContent) columns.push(sidebarContent);

  // if neither column found, fallback to all immediate children
  if (columns.length === 0) {
    columns.push(...Array.from(element.children));
  }

  // Compose the table array
  const cells = [];
  cells.push(['Columns (columns11)']);
  cells.push(columns);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}