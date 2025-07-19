/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content and sidebar as direct children of the page structure
  // The main column is a <main> containing a cmp-container with article etc.
  // The aside column is an <aside> with a cmp-container with sidebar
  // Only include as columns if content exists

  // Find the main column (the main content area)
  let mainCol = null;
  let asideCol = null;
  // The structure is: <main class="container ..."> > <div id=...> ...<main>...</main><aside>...</aside>
  // We'll look for first-level <main> and <aside> inside 'element'.
  const mainChild = element.querySelector(':scope > div > main');
  const asideChild = element.querySelector(':scope > div > aside');

  // For the main column, prefer the inner cmp-container holding the article
  if (mainChild) {
    const contentContainer = mainChild.querySelector(':scope > div.cmp-container');
    mainCol = contentContainer || mainChild;
  }

  // For the aside column, prefer the inner cmp-container
  if (asideChild) {
    const sidebarContainer = asideChild.querySelector(':scope > div.cmp-container');
    asideCol = sidebarContainer || asideChild;
  }

  // Only add the aside column if it exists
  let cells;
  if (mainCol && asideCol) {
    cells = [
      ['Columns (columns13)'],
      [mainCol, asideCol]
    ];
  } else if (mainCol) {
    // Fallback: only main column
    cells = [
      ['Columns (columns13)'],
      [mainCol]
    ];
  } else {
    // If nothing found, don't do anything
    return;
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
