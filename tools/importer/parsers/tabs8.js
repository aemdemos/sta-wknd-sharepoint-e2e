/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block, which contains the tabs UI
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tab list
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab contents: directly under .cmp-tabs, look for [role=tabpanel]
  const tabPanels = Array.from(tabs.querySelectorAll(':scope > div[role="tabpanel"]'));
  const tabContents = tabPanels.map(panel => {
    // Prefer the main article/contentfragment inside the panel if present
    const article = panel.querySelector('article');
    return article ? article : panel;
  });

  // Build the table as in the Markdown example:  
  // 1. Header: ['Tabs (tabs8)']
  // 2. Tab labels row: each label is a column header
  // 3. Tab contents row: each cell is the content for the corresponding tab

  // If there are missing labels or contents, ensure alignment
  const maxTabs = Math.max(tabLabels.length, tabContents.length);
  while (tabLabels.length < maxTabs) tabLabels.push('');
  while (tabContents.length < maxTabs) tabContents.push('');
  
  const cells = [
    ['Tabs (tabs8)'],
    tabLabels,
    tabContents
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
