/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container that actually has the tabs (class .tabs)
  let tabsBlock = element.querySelector('.tabs.panelcontainer, .tabs');
  if (!tabsBlock) return;

  // Find the .cmp-tabs structure
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the cmp-tabs__tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLis.map(tabLi => tabLi.textContent.trim());

  // Get the tab panels (order should match tab labels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabPanels.length) return;

  // Build table cells array
  const cells = [
    ['Tabs (tabs34)']
  ];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    // If a panel exists for this label, use it, else skip
    if (!tabPanels[i]) continue;

    // Reference the existing content block (tabPanel) directly
    // The tabPanel contains inner structure (articles/images/etc)
    cells.push([
      tabLabels[i],
      tabPanels[i]
    ]);
  }

  // Create and replace with the tab table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
