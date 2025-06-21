/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block spec
  const headerRow = ['Columns (columns30)'];

  // --- Extract Left Column (Sidebar with details and share) ---
  // The left column is the sidebar grid with the cmp-contentfragment (details), share title, and share buttons
  let leftCol = document.createElement('div');
  const leftGrid = element.querySelector('div.cmp-container > div.aem-Grid.aem-Grid--3');
  if (leftGrid) {
    // Details (cmp-contentfragment)
    const detailsFragment = leftGrid.querySelector('.cmp-contentfragment');
    if (detailsFragment) leftCol.appendChild(detailsFragment);
    // Share title
    const shareTitle = leftGrid.querySelector('.title .cmp-title');
    if (shareTitle) leftCol.appendChild(shareTitle);
    // Share buttons
    const sharing = leftGrid.querySelector('.sharing');
    if (sharing) leftCol.appendChild(sharing);
  }

  // --- Extract Right Column (Tabbed content) ---
  // The right column is the tabs block (all tabs and content)
  let rightCol = document.createElement('div');
  const tabsBlock = element.querySelector('div.tabs .cmp-tabs');
  if (tabsBlock) rightCol.appendChild(tabsBlock);

  // Compose the columns block as specified
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
