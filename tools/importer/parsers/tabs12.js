/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the supplied element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels in order
  const tabsList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabsList) return;
  const labelNodes = Array.from(tabsList.querySelectorAll('.cmp-tabs__tab'));
  if (labelNodes.length === 0) return;
  const tabLabels = labelNodes.map(li => li.textContent.trim());

  // Get the tab panels in order
  // For each tab, get the corresponding tabpanel by order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: Only process as many panels as there are labels (and vice versa)
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the block header (matches spec)
  const headerRow = ['Tabs (tabs12)'];
  // Tab labels row (second row of table, one label per column)
  const labelsRow = tabLabels.slice(0, numTabs);
  // Content row: each cell is the .contentfragment (full <article> element inside panel) or the panel itself if missing
  const contentRow = tabPanels.slice(0, numTabs).map(panel => {
    // Get the first contentfragment/article inside the panel
    const article = panel.querySelector('article');
    if (article) return article;
    // fallback: include the full panel
    return panel;
  });

  // Compose cells according to block spec: 1 header row, 1 tab label row, 1 content row
  const cells = [headerRow, labelsRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block in the DOM
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
