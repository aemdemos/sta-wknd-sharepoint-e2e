/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels and tab ids
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  const tabLabels = [];
  const tabIds = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
      let tabId = tab.id;
      if (tabId.endsWith('-tab')) {
        tabId = tabId.slice(0, -4); // Remove '-tab' from the end
      }
      tabIds.push(tabId);
    });
  }

  // Extract panels by tabId
  const tabPanels = tabIds.map(tabId => {
    return tabsBlock.querySelector(`#${tabId}-tabpanel`);
  });

  // Compose the final table
  // Header row: block name (single cell)
  const headerRow = ['Tabs (tabs25)'];
  // Second row: all tab labels (one per col)
  const labelRow = tabLabels;

  // Third row: each corresponding tab content (one per col), referencing the main content node of each tab
  const contentRow = tabPanels.map(panel => {
    if (!panel) return '';
    // Prefer to extract the main content, usually article.cmp-contentfragment or .contentfragment, or else the full panel
    const content = panel.querySelector('article.cmp-contentfragment')
      || panel.querySelector('.contentfragment')
      || panel;
    return content;
  });

  const cells = [headerRow, labelRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
