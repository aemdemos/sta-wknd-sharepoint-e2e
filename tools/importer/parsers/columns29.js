/* global WebImporter */
export default function parse(element, { document }) {
  // The Columns block always starts with a single header row
  const headerRow = ['Columns (columns29)'];

  // Helper: get the main grid of the page that contains the columns
  function getMainGrid(main) {
    return main.querySelector(':scope > div > div.aem-Grid');
  }

  // Find the main grid
  const mainGrid = getMainGrid(element);
  if (!mainGrid) return; // Defensive: only process if grid found

  // Find columns: main content and sidebar
  const gridColumns = Array.from(mainGrid.children).filter(
    c =>
      c.tagName === 'MAIN' ||
      c.tagName === 'ASIDE' ||
      c.classList.contains('aem-GridColumn') ||
      c.classList.contains('container')
  );

  // Main content column (first)
  let mainCol = gridColumns.find(c => c.tagName === 'MAIN' || c.classList.contains('cmp-layout-container--fixed') || c.classList.contains('aem-GridColumn--default--8'));
  if (!mainCol) mainCol = gridColumns[0];
  // Sidebar column (second)
  let asideCol = gridColumns.find(c => c.tagName === 'ASIDE' || c.classList.contains('cmp-layoutcontainer--sidebar') || c.classList.contains('aem-GridColumn--default--3'));
  if (!asideCol && gridColumns.length > 1) asideCol = gridColumns[1];

  // --- LEFT COLUMN CONTENT (main) ---
  let leftCell;
  if (mainCol) {
    let mainContainer = mainCol.querySelector(':scope > div > div.cmp-container');
    if (!mainContainer) mainContainer = mainCol.querySelector(':scope > div');
    if (!mainContainer) mainContainer = mainCol;
    leftCell = Array.from(mainContainer.children).filter(
      node => {
        if (node.nodeType !== 1) return false;
        if (node.textContent.trim().length > 0) return true;
        if (node.querySelector('img, picture, svg, video')) return true;
        return false;
      }
    );
  } else {
    leftCell = [];
  }

  // --- RIGHT COLUMN CONTENT (aside) ---
  let rightCell = [];
  if (asideCol) {
    // Sidebar grid: <aside> > <div> > <div.aem-Grid>
    let asideGrid = asideCol.querySelector(':scope > div > div.aem-Grid');
    if (!asideGrid) asideGrid = asideCol.querySelector(':scope > div');
    if (!asideGrid) asideGrid = asideCol;
    // Find blocks for sidebar: SHARE THIS STORY title, sharing (button block), up next list
    // We want to include all children (title, sharing, list etc) and preserve order
    // So, get all children, but remove empty ones
    let asideChildren = Array.from(asideGrid.children).filter(node => {
      if (node.nodeType !== 1) return false;
      if (node.textContent.trim().length > 0) return true;
      if (node.querySelector('img, picture, svg, video, a')) return true;
      return false;
    });
    
    // In the HTML, there is a <div class="sharing ..."> between the title and list
    // containing (1) the fb-share-button <div> and (2) the Pinterest link <a>
    // These need to be included in the block, even if they are empty or odd
    for (let i = 0; i < asideChildren.length; i++) {
      const node = asideChildren[i];
      if (node.classList.contains('sharing')) {
        // For this sharing block, extract each child:
        const sharingItems = [];
        // Facebook button is a div (may be empty visually)
        const fb = node.querySelector('div.fb-share-button');
        if (fb) sharingItems.push(fb);
        // Pinterest is an <a>
        const pin = node.querySelector('a[data-pin-do]');
        if (pin) sharingItems.push(pin);
        // Add sharingItems as a flat array
        if (sharingItems.length) {
          rightCell.push(...sharingItems);
        }
      } else {
        rightCell.push(node);
      }
    }
  }

  // Compose the columns block: header, then a row of columns (each column is a cell)
  const tableRows = [headerRow, [leftCell, rightCell]];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
