/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tab list (li[role=tab])
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabels.length) return;

  // Get the panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // Safety: Only pair up to the minimum number of tabs/panels
  const count = Math.min(tabLabels.length, tabPanels.length);
  
  // Compose header row
  const headerRow = ['Tabs (tabs37)'];

  // Compose the row of tab labels
  const tabLabelRow = tabLabels.slice(0, count).map(tab => tab.textContent.trim());

  // Compose the row of tab contents, using existing elements
  const tabContentRow = tabPanels.slice(0, count).map(panel => {
    // Find the contentfragment/article if present, otherwise use full panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    return contentFragment || panel;
  });

  // Final table rows: block name, labels, contents
  const cells = [headerRow, tabLabelRow, tabContentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
