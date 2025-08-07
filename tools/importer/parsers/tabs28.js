/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 1. Tab Labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    const tabLis = tabList.querySelectorAll('li[role="tab"]');
    tabLis.forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // 2. Tab Contents
  // Find all tabpanels (the order should match tab labels)
  const tabPanels = tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');
  const tabContents = [];
  tabPanels.forEach(panel => {
    // If there's a contentfragment, use it, otherwise use the panel itself
    const cf = panel.querySelector('.contentfragment') || panel;
    tabContents.push(cf);
  });

  // 3. Table Structure: first row is the header, second row is the tab labels, third row is the tab contents
  const headerRow = ['Tabs (tabs28)'];
  // Defensive: ensure tabLabels and tabContents lengths match (fill with empty string if needed)
  const maxTabs = Math.max(tabLabels.length, tabContents.length);
  const labelRow = [];
  const contentRow = [];
  for (let i = 0; i < maxTabs; i++) {
    labelRow.push(tabLabels[i] || '');
    contentRow.push(tabContents[i] || document.createElement('div'));
  }

  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
