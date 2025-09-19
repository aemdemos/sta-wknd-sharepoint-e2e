/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.panelcontainer block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Always use the required block name as the header row
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Reference the contentfragment/article inside the tabpanel if present, otherwise the panel itself
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        tabContent = panel;
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block
  tabsContainer.replaceWith(block);
}
