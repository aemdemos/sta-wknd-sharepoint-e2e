/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element (the tab block root)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelNodes = tabList.querySelectorAll('li');
  const tabLabels = Array.from(tabLabelNodes).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const panelNodes = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');
  if (!panelNodes.length) return;

  // Each panel: extract main content area (prefer contentfragment/article, fallback to panel itself)
  const tabContents = Array.from(panelNodes).map(panel => {
    // Try to find the main content area for this tab
    // Use the article.cmp-contentfragment if present, else .contentfragment, else panel itself
    let content = panel.querySelector('article.cmp-contentfragment')
      || panel.querySelector('.contentfragment')
      || panel;
    return content;
  });

  // Build header row: block name exactly as required
  const headerRow = ['Tabs (tabs11)'];
  // Build row of tab labels (one cell per tab)
  const tabLabelRow = tabLabels;
  // Build row of tab contents (one cell per tab, each cell is reference to a DOM node)
  const tabContentRow = tabContents;

  // Construct the table for the block
  const tableCells = [headerRow, tabLabelRow, tabContentRow];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the tabs block root with the block table
  tabsRoot.replaceWith(block);
}
