/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs element inside the block
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (in order)
  const tabList = tabsBlock.querySelector('[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    const tabItems = tabList.querySelectorAll('[role="tab"]');
    tabItems.forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (in order)
  const tabPanels = [];
  const panelNodes = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  panelNodes.forEach(panel => {
    // For resilience, get the main content node, else use the panel itself
    // Usually a .contentfragment or article direct child
    let mainContent = panel.querySelector('article, .contentfragment');
    if (!mainContent) mainContent = panel;
    tabPanels.push(mainContent);
  });

  // Build table rows
  const rows = [];
  rows.push(['Tabs (tabs36)']);
  for (let i = 0; i < tabLabels.length; i++) {
    // Use referenced existing elements
    const label = tabLabels[i] || '';
    const content = tabPanels[i] || '';
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
