/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll(':scope > li.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  // Extract tab panels in the same order as labels
  const tabPanels = Array.from(tabs.querySelectorAll(':scope > [data-cmp-hook-tabs="tabpanel"]'));
  // If not found as immediate children, fallback to descendants
  if (tabPanels.length === 0) {
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]').forEach(panel => {
      tabPanels.push(panel);
    });
  }
  // Prepare table rows
  const cells = [
    ['Tabs (tabs29)']
  ];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    let content = '';
    const panel = tabPanels[i];
    if (panel) {
      // If there's a single main content fragment/article, use it
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Otherwise, use all direct children as an array (for robustness)
        const children = Array.from(panel.children);
        content = children.length === 1 ? children[0] : children;
      }
    }
    cells.push([label, content]);
  }
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}