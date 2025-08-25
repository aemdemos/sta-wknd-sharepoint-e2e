/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tabs (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Find the tab panels
  // .cmp-tabs__tabpanel are the panels, and order matches tabLabels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: Only pair as many as both exist
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the table header: always the block name
  const cells = [
    ['Tabs (tabs34)'],
  ];

  // For each tab, add a row of [Label, Content]
  for(let i=0; i<numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find main content in the panel: prefer .contentfragment or .cmp-contentfragment, fall back to panel
    const content = panel.querySelector('.contentfragment, .cmp-contentfragment') || panel;
    cells.push([label, content]);
  }

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
