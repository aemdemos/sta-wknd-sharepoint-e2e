/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the outermost .cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from tablist in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  // Get tab panel elements in order (they are .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the rows: first row is header (single cell), each tab is [label, content]
  const rows = [];
  rows.push(['Tabs (tabs31)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    rows.push([label, panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block in the DOM
  tabsRoot.replaceWith(block);
}
