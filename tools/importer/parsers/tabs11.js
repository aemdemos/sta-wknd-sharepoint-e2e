/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = [];
  cmpTabs.querySelectorAll('div[role="tabpanel"]').forEach(panel => {
    // Defensive: get the contentfragment article inside each panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabPanels.push(contentFragment);
    } else {
      // fallback: use the panel itself
      tabPanels.push(panel);
    }
  });

  // Build rows for each tab
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      tabPanels[i] || document.createElement('div') // fallback empty div if missing
    ]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs11)'];

  // Compose the table
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the tabs block with the new table
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
