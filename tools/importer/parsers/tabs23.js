/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab list (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const labels = tabLabelElements.map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanelElements = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: skip malformed tabs
  const numTabs = Math.min(labels.length, tabPanelElements.length);

  // For each tab, extract the main visible content from the tabpanel
  const tabContents = [];
  for (let i = 0; i < numTabs; i += 1) {
    // Usually the direct child is a div.contentfragment, which contains the article
    // We'll take the article element if present, otherwise the panel itself
    const panel = tabPanelElements[i];
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // Fallback to the whole panel if article is missing
      content = panel;
    }
    tabContents.push(content);
  }

  // Build the table: first row is header, then one row per tab
  const tableRows = [
    ['Tabs (tabs23)'],
  ];
  for (let i = 0; i < numTabs; i += 1) {
    tableRows.push([
      labels[i],
      tabContents[i],
    ]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsBlock.replaceWith(block);
}
