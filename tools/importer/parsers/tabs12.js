/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 2. Extract tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // 3. Extract tab panels in the same order as the labels
  // The tab panels are direct children of .cmp-tabs, order matches the tabs
  const panelNodes = Array.from(
    tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // 4. Compose table rows: first header, then [tab label, tab content] per tab
  const rows = [ ['Tabs (tabs12)'] ];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panelNodes[i];
    let content = '';
    if (panel) {
      // Only use the main content inside the tab panel
      // Prefer .contentfragment > article, but fallback to full panel if missing
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // As backup, include the entire panel
        content = panel;
      }
    }
    rows.push([label, content]);
  }

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the cmp-tabs element with the new table
  tabsBlock.replaceWith(table);
}
