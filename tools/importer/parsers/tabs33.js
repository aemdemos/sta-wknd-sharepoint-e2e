/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the main tabs block (should have .tabs and contain .cmp-tabs)
  let tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // 2. Extract tab labels in order
  let tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());
  }

  // 3. Extract tab panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we only use min(tabLabels.length, tabPanels.length)
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  if (tabCount === 0) return;

  // 4. Build the header row: the block name
  const rows = [["Tabs (tabs33)"]];

  // 5. For each tab, add a row: [tab label, tab panel content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    // Reference the main tab content. Use the first meaningful child inside the tabpanel.
    const tabPanel = tabPanels[i];
    // Try to find a contentfragment or a .contentfragment or .cmp-contentfragment__elements
    let content = null;
    // Sometimes there is an article, sometimes just a div
    content = tabPanel.querySelector('article, .contentfragment, .cmp-contentfragment__elements, div');
    if (!content) content = tabPanel;
    rows.push([label, content]);
  }

  // 6. Replace the tabs block with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
