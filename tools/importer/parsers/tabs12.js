/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .cmp-tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 2. Extract tab labels in order
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 3. Extract the tab contents in the same order as labels
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const rows = [];

  // 4. First row: header from block name
  rows.push(['Tabs (tabs12)']);

  // 5. For each tab, add a row of [label, content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    let content = null;
    if (panel) {
      // Try to extract the main <article> if present, for full content
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Use everything inside the panel
        const contentFragment = document.createElement('div');
        // Move all children (preserve references)
        while (panel.firstChild) {
          contentFragment.appendChild(panel.firstChild);
        }
        content = contentFragment;
      }
    }
    rows.push([label, content]);
  });

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 7. Replace the .cmp-tabs block with our new table
  tabsBlock.replaceWith(block);
}
