/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (main tab container)
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (actual tabs)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels (usually in .cmp-tabs__tablist > li[role=tab])
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(li => li.textContent.trim()) : [];

  // Extract tab panels (.cmp-tabs__tabpanel), keep order matching tabLabels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Only proceed if at least one label/panel exists
  if (!tabLabels.length || !tabPanels.length) return;

  // Build header row as specified
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // Utility for robust extraction of main tab content
  function extractTabContent(panel) {
    // Try .contentfragment or .cmp-contentfragment block
    let mainContent = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (mainContent) return mainContent;
    // If not found, grab all element children
    const childEls = Array.from(panel.children);
    if (childEls.length === 1) return childEls[0];
    if (childEls.length > 1) {
      const wrapper = document.createElement('div');
      childEls.forEach(el => wrapper.appendChild(el));
      return wrapper;
    }
    // Fallback: use panel itself
    return panel;
  }

  // Loop through each tab label/panel and build row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    const content = extractTabContent(panel);
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the new block table
  tabsContainer.replaceWith(table);
}
