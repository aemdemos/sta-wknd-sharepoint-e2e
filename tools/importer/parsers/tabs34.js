/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (ordered)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')).map(tab => tab.textContent.trim());

  // Get all tab content panels (ordered)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Only add rows for tabs that have both a label and a content panel
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the cells array for the block table
  // Row 1: header
  // Row 2+: each tab row: [label, content]
  const cells = [];
  // Header row - must match the block name exactly
  cells.push(['Tabs (tabs34)']);
  
  for (let i = 0; i < numTabs; i++) {
    // Tab label
    const label = tabLabels[i];
    // Tab content - use the contentfragment article if present, else the whole tabpanel
    let tabContent = tabPanels[i].querySelector('article');
    if (!tabContent) tabContent = tabPanels[i];
    cells.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in-place
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
