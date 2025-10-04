/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: get the main contentfragment/article inside the panel
    let content = panel.querySelector('article') || panel;
    rows.push([label, content]);
  }

  // Table header
  const headerRow = ['Tabs (tabs31)'];

  // Compose table data
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
