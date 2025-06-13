/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the .tabs wrapper containing .cmp-tabs)
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const cmpTabs = tabsSection.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist (order matters)
  const tabNodes = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabLabels = tabNodes.map(tab => tab.textContent.trim());

  // Get the tab panels (order matches tabNodes)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));
  // If there are fewer panels than tabs, skip rows for missing

  // Header row: Block name exactly as specified
  const headerRow = ['Tabs (tabs28)'];
  const table = [headerRow];

  // Build all tab rows
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let panelContentEl = null;
    if (i < tabPanels.length) {
      // prefer the .contentfragment inside the panel, else the panel itself
      const cf = tabPanels[i].querySelector('.contentfragment') || tabPanels[i];
      panelContentEl = cf;
    } else {
      panelContentEl = '';
    }
    table.push([label, panelContentEl]);
  }
  const block = WebImporter.DOMUtils.createTable(table, document);
  tabsSection.replaceWith(block);
}
