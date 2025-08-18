/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block's main container
  let cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) {
    // Try direct match as fallback
    cmpTabs = element;
    if (!cmpTabs.classList.contains('cmp-tabs')) return;
  }

  // Extract tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Extract tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Edge case: Ensure same count for labels and panels
  if (!tabLabels.length || tabPanels.length !== tabLabels.length) return;

  // Build header row (block name matches example exactly)
  const headerRow = ['Tabs (tabs37)'];
  // Tabs row: The tab labels in each column
  const tabsRow = tabLabels;
  // Content row: Reference existing tab panel elements (not cloning)
  const contentRow = tabPanels;

  // Final cells array: 3 rows, n columns (n = number of tabs)
  const cells = [headerRow, tabsRow, contentRow];

  // Create the tabs block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block element
  cmpTabs.replaceWith(blockTable);
}
