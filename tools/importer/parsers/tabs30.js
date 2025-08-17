/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 2. Get tab labels
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // 3. Get panels for each tab in order
  // Use aria-controls to pair tab with tabpanel
  const cells = [['Tabs (tabs30)']]; // header row
  tabItems.forEach(tab => {
    const tabLabel = tab.textContent.trim();
    const panelId = tab.getAttribute('aria-controls');
    let panel = panelId ? tabsBlock.querySelector(`#${panelId}`) : null;
    let content = null;
    if (panel) {
      // Always try to find the main contentfragment article inside the panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // fallback to all children
        if (panel.children.length > 0) {
          content = Array.from(panel.children);
        } else {
          // fallback to empty div
          content = document.createElement('div');
        }
      }
    } else {
      content = document.createElement('div');
    }
    cells.push([tabLabel, content]);
  });

  // 4. Replace the tabs block with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
