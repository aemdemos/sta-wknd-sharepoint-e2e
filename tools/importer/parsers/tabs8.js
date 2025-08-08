/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  let tabOrder = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
      const tabId = tab.getAttribute('aria-controls');
      tabOrder.push(tabId);
    });
  }

  // Get all tab panels according to tabOrder
  const tabPanels = tabOrder.map(id => tabs.querySelector(`#${id}`));

  // Build table rows: first row is header, rest are one row per tab (tab label, tab content)
  // Per the markdown example, header is one cell: ['Tabs (tabs8)']
  // Each subsequent row: [tab label, tab content]
  const rows = [];
  rows.push(['Tabs (tabs8)']);
  for(let i=0; i<tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let content = null;
    if(tabPanel) {
      // Try to find the main content element for that tab
      // Usually article, but fallback to first .contentfragment, else to tabPanel
      let mainContent = tabPanel.querySelector('article') || tabPanel.querySelector('.contentfragment') || tabPanel;
      content = mainContent;
    } else {
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  }
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
