/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Tabs block root with class 'tabs'
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the .cmp-tabs container within the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab label elements in order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).filter(x => x.matches('.cmp-tabs__tab'));

  // Get all tab panels in order
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: skip if lengths mismatch
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the table array. Header is block name (from prompt, must be exact)
  const cells = [['Tabs (tabs17)']];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const panelEl = tabPanels[i];

    // Defensive: skip if missing
    if (!labelEl || !panelEl) continue;
    // Tab label
    const label = labelEl.textContent.trim();
    // Content: use the .contentfragment inside the panel if available, else the whole panel
    const contentFragment = panelEl.querySelector('.contentfragment') || panelEl;
    cells.push([label, contentFragment]);
  }

  // Create table block
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
