/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find immediate child with a class
  function $childByClass(el, className) {
    return Array.from(el.children).find(c => c.classList && c.classList.contains(className));
  }

  // Root: <main class="container ..."> (element)
  // Structure: element > div.cmp-container > div.aem-Grid (main grid)
  const cmpContainer = element.querySelector(':scope > div.cmp-container');
  if (!cmpContainer) return;
  const aemGrid = $childByClass(cmpContainer, 'aem-Grid');
  if (!aemGrid) return;

  // --- LEFT COLUMN ---
  // Target: main.container (inner), then its cmp-container, then its aem-Grid
  let leftColContent = [];
  let leftColGrid;
  // Find the inner main.container (first main inside aem-Grid)
  const innerMain = aemGrid.querySelector(':scope > main.container');
  if (innerMain) {
    const innerContainer = innerMain.querySelector(':scope > div.cmp-container');
    if (innerContainer) {
      leftColGrid = $childByClass(innerContainer, 'aem-Grid');
    }
  }
  if (leftColGrid) {
    // Article: activity, details
    const detailsFragment = leftColGrid.querySelector('article.cmp-contentfragment');
    if (detailsFragment) leftColContent.push(detailsFragment);
    // 'Share this Adventure' title
    const shareTitle = leftColGrid.querySelector('.title .cmp-title');
    if (shareTitle) leftColContent.push(shareTitle);
    // Social buttons
    const sharing = leftColGrid.querySelector('.sharing');
    if (sharing) leftColContent.push(sharing);
  }

  // --- RIGHT COLUMN ---
  // Target: tabs.panelcontainer (direct child of aemGrid)
  let rightColContent = [];
  const tabsPanel = $childByClass(aemGrid, 'tabs');
  if (tabsPanel) {
    // Just the .cmp-tabs inside
    const cmpTabs = tabsPanel.querySelector(':scope > .cmp-tabs');
    if (cmpTabs) rightColContent.push(cmpTabs);
  }

  // --- Compose columns block table ---
  const headerRow = ['Columns (columns6)'];
  // Always two cells in the second row, per example structure
  const contentRow = [leftColContent, rightColContent];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
